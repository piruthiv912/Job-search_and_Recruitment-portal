const Company = require('../models/Company');
const logActivity = require('../utils/logActivity');

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCompany = async (req, res) => {
  try {
    const { name, description, website, location, industry } = req.body;

    const company = new Company({
      name,
      description,
      website,
      location,
      industry,
      recruiter: req.userId
    });

    await company.save();
    await logActivity({
      type: 'company.created',
      actorId: req.userId,
      actorName: company.name,
      message: `Company profile created for ${company.name}`,
      metadata: { companyId: company._id },
      sourceKey: `company.created:${company._id}`
    });
    res.status(201).json({ message: 'Company created successfully', company });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ recruiter: req.userId });
    if (!company) {
      return res.status(404).json({ message: 'No company profile found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCompanies, createCompany, getCompanyById, getMyCompany };
