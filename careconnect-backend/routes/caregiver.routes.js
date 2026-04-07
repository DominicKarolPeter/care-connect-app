const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');
const CaregiverController = require('../controllers/caregiver.controller');
const upload = require('../middlewares/upload.middleware');
const CaregiverProfile = require('../models/caregiverProfile.model');

// POST: create caregiver profile
router.post(
  '/upload-documents',
  authenticate, // ensure caregiver is logged in
  authorizeRole(['caregiver']),
  upload.single('document'), // upload key = document
  async (req, res) => {
    try {
      const fileUrl = `/uploads/${req.file.filename}`;
      const caregiverId = req.localUser.id;

      // Update caregiver profile with document URL
      const updated = await CaregiverProfile.updateDocumentUrl(caregiverId, fileUrl);

      res.status(200).json({
        message: 'Document uploaded successfully',
        document_url: fileUrl
      });
    } catch (err) {
      res.status(500).json({ message: 'Upload failed', error: err.message });
    }
  }
);

// GET: get own caregiver profile
router.get(
  '/profile',
  authenticate,
  authorizeRole(['caregiver']),
  CaregiverController.getProfile
);

router.get(
  '/earnings',
  authenticate,
  authorizeRole(['caregiver']),
  CaregiverController.getEarnings
);

router.patch(
  '/online-status',
  authenticate,
  authorizeRole(['caregiver']),
  CaregiverController.setOnlineStatus
);
router.patch(
  '/location',
  (req, res, next) => { console.log("📍Location route hit"); next(); },
  authenticate,
  authorizeRole(['caregiver']),
  CaregiverController.updateLocation
);

// GET: public caregiver listings (for customers)
router.get(
  '/',
  // authenticate, // Optional: only allow logged-in customers
  // authorizeRole(['customer']), // Optional role restriction
  CaregiverController.getAllCaregivers
);
module.exports = router;