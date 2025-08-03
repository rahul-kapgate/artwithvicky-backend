import User from "../models/User.model.js";
import Course from "../models/Course.model.js";
import MockTest from "../models/MockTest.model.js";

// Get all users with their authorized courses
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("fullName email authorizedCourses")
      .populate("authorizedCourses", "title");
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Get Users Error:", err.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Assign courses to a user
export const assignCourses = async (req, res) => {
  const { userId, courseIds } = req.body;

  try {
    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate courses
    const courses = await Course.find({ _id: { $in: courseIds } });
    if (courses.length !== courseIds.length) {
      return res.status(400).json({ message: "One or more courses not found" });
    }

    // Add courses to user's authorizedCourses (avoid duplicates)
    user.authorizedCourses = [
      ...new Set([...user.authorizedCourses, ...courseIds]),
    ];
    await user.save();

    res.status(200).json({ message: "Courses assigned successfully" });
  } catch (err) {
    console.error("❌ Assign Courses Error:", err.message);
    res.status(500).json({ message: "Failed to assign courses" });
  }
};

// Remove courses from a user
export const removeCourses = async (req, res) => {
  const { userId, courseIds } = req.body;

  try {
    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove courses from authorizedCourses
    user.authorizedCourses = user.authorizedCourses.filter(
      (courseId) => !courseIds.includes(courseId.toString())
    );
    await user.save();

    res.status(200).json({ message: "Courses removed successfully" });
  } catch (err) {
    console.error("❌ Remove Courses Error:", err.message);
    res.status(500).json({ message: "Failed to remove courses" });
  }
};


export const getAllUsersWithMockTests = async (req, res) => {
  try {
    // Populate users with their mock tests
    const users = await User.find()
      .select("fullName email mobile") // Include necessary fields
      .lean(); // Returns plain JS objects instead of Mongoose documents

    // Fetch all mock tests, grouped by user
    const mockTests = await MockTest.find()
      .select("mockTestNumber dateOfTest totalMarks obtainedMarks user")
      .populate("user", "email") // optional, for verification
      .lean();

    // Group mock tests by userId
    const mockTestsByUserId = {};
    mockTests.forEach(test => {
      const uid = test.user._id.toString();
      if (!mockTestsByUserId[uid]) {
        mockTestsByUserId[uid] = [];
      }
      mockTestsByUserId[uid].push({
        mockTestNumber: test.mockTestNumber,
        dateOfTest: test.dateOfTest,
        totalMarks: test.totalMarks,
        obtainedMarks: test.obtainedMarks,
      });
    });

    // Combine user and their mock test details
    const result = users.map(user => ({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      mockTests: mockTestsByUserId[user._id.toString()] || [],
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Admin Mock Test Fetch Error:", err.message);
    res.status(500).json({ message: "Failed to fetch user mock test details" });
  }
};
