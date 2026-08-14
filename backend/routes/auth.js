const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

let protect;
try {
  protect = require('../middleware/auth').protect;
  if (!protect) throw new Error('protect is undefined');
} catch (e) {
  console.error('Failed to load protect middleware:', e.message);
  process.exit(1);
}

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── POST /api/auth/send-otp ──────────────────
router.post(
  '/send-otp',
  [body('email').isEmail().withMessage('Valid email required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ success: false, message: 'No account found with this email.' });

      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await User.findByIdAndUpdate(user._id, { otp, otpExpiry });

      await transporter.sendMail({
        from: `"Devora" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Devora Login Verification Code',
        html: `
          <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;background:#090d16;color:#e2e8f0;border-radius:12px;border:1px solid #1e293b;">
            <h2 style="color:#6366f1;margin-bottom:8px;">⚡ Devora</h2>
            <p style="color:#94a3b8;">Your one-time developer login code is:</p>
            <div style="font-size:36px;font-weight:700;letter-spacing:8px;color:#fff;margin:16px 0;">${otp}</div>
            <p style="color:#64748b;font-size:13px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          </div>
        `,
      });

      res.json({ success: true, message: 'OTP sent to your email.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ── POST /api/auth/verify-otp ────────────────
router.post(
  '/verify-otp',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email }).select('+otp +otpExpiry');

      if (!user)
        return res.status(404).json({ success: false, message: 'User not found.' });

      if (!user.otp || !user.otpExpiry)
        return res.status(400).json({ success: false, message: 'No OTP requested. Please request a new one.' });

      if (new Date() > user.otpExpiry)
        return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });

      if (user.otp !== otp)
        return res.status(401).json({ success: false, message: 'Invalid OTP.' });

      await User.findByIdAndUpdate(user._id, { otp: null, otpExpiry: null });

      const token = generateToken(user._id);
      res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, interests: user.interests, defaultTone: user.defaultTone },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ── POST /api/auth/register ──────────────────
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { name, email, password, targetRole } = req.body;
      const existing = await User.findOne({ email });
      if (existing)
        return res.status(400).json({ success: false, message: 'Email already registered.' });

      const user = await User.create({
        name,
        email,
        password,
        targetRole: typeof targetRole === 'string' ? targetRole : 'Full Stack Developer'
      });
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel,
          skills: user.skills
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ── POST /api/auth/login ─────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.matchPassword(password)))
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });

      const token = generateToken(user._id);
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          experienceLevel: user.experienceLevel,
          skills: user.skills,
          avatar: user.avatar
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);
// ── POST /api/auth/google ────────────────────
router.post('/google', async (req, res) => {
  try {
    const { credential, accessToken, googleUser } = req.body;
    let email, name, googleId, avatar;

    if (credential) {
      // Verify Google ID Token via Google's tokeninfo API
      const fetch = require('node-fetch');
      const gRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      if (gRes.ok) {
        const payload = await gRes.json();
        email = payload.email;
        name = payload.name || payload.given_name || (email ? email.split('@')[0] : 'Google User');
        googleId = payload.sub;
        avatar = payload.picture;
      }
    } else if (accessToken) {
      // Verify via userinfo API
      const fetch = require('node-fetch');
      const gRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (gRes.ok) {
        const payload = await gRes.json();
        email = payload.email;
        name = payload.name || payload.given_name || (email ? email.split('@')[0] : 'Google User');
        googleId = payload.sub;
        avatar = payload.picture;
      }
    } else if (googleUser && googleUser.email) {
      // Direct payload (e.g. client profile or dev mode)
      email = googleUser.email;
      name = googleUser.name || (email ? email.split('@')[0] : 'Google User');
      googleId = googleUser.id || googleUser.sub || `google_${Date.now()}`;
      avatar = googleUser.avatar || googleUser.picture;
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Invalid Google authentication response.' });
    }

    // Find or create user
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      if (!user.googleId) user.googleId = googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        interests: ['technology', 'business'],
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests,
        defaultTone: user.defaultTone,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ success: false, message: err.message || 'Google Sign-In failed.' });
  }
});


// ── GET /api/auth/me ─────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// ── PUT /api/auth/update ─────────────────────
router.put('/update', protect, async (req, res) => {
  try {
    const {
      name,
      avatar,
      targetRole,
      experienceLevel,
      skills,
      bio,
      github,
      linkedin,
      portfolio,
      darkMode
    } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (targetRole !== undefined) updateFields.targetRole = targetRole;
    if (experienceLevel !== undefined) updateFields.experienceLevel = experienceLevel;
    if (skills !== undefined) updateFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (bio !== undefined) updateFields.bio = bio;
    if (github !== undefined) updateFields.github = github;
    if (linkedin !== undefined) updateFields.linkedin = linkedin;
    if (portfolio !== undefined) updateFields.portfolio = portfolio;
    if (darkMode !== undefined) updateFields.darkMode = darkMode;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;