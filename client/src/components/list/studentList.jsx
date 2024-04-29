import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getStudent,
  getFilteredStudents,
  getCourses,
  deleteStudent,
} from "../../services/ApiService";
import "./../../Assets/styles/student.css";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]); // Corrected from allCourses to courses
  const [selectedCourseId, setSelectedCourseId] = useState(""); // To store the selected course ID for filtering
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const filters = {};
        if (gender) filters.gender = gender;

        const fetchedStudents = Object.keys(filters).length
          ? await getFilteredStudents(filters)
          : await getStudent();

        setStudents(fetchedStudents);

        const fetchedCourses = await getCourses();
        console.log("Fetched Courses:", fetchedCourses); // Log fetched courses
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [gender]);

  const handleCourseChange = (e) => {
    // Optionally convert the value to a number if your IDs are numeric
    setSelectedCourseId(e.target.value);
  };

  const getFilteredStudentsByCourse = () => {
    console.log("Selected Course ID:", selectedCourseId); // Debug: Check the selected course ID
    console.log("All Students:", students); // Debug: List all students
    console.log("All Courses:", courses); // Debug: List all courses

    if (!selectedCourseId) {
      return students; // If no course is selected, return all students
    }

    const filteredStudents = students.filter((student) => {
      // Convert both to strings for comparison to avoid type mismatch issues
      return student.course_id.toString() === selectedCourseId.toString();
    });

    console.log("Filtered Students:", filteredStudents); // See the filtered list
    return filteredStudents;
  };

  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) {
      return; // Cancel deletion if user clicks cancel
    }

    try {
      await deleteStudent(studentId);
      setStudents(
        students.filter((student) => student.student_id !== studentId)
      );
      console.log("Student successfully deleted.");
    } catch (error) {
      console.error("Error deleting student:", error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="px-5 mt-3">
      <h2 className="student-list-title">Student List</h2>
      <div className="d-flex justify-content-between mb-3">
        <Link to="/sidebar" className="btn1-back">
          Back
        </Link>
        <Link to="/add_student" className="btn1-add">
          Add Student
        </Link>
        <div>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="form-select"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <select
          value={selectedCourseId}
          onChange={handleCourseChange}
          className="form-select"
        >
          <option value="">Filter by Course</option>
          {courses.map((course) => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_name}
            </option>
          ))}
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Number</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredStudentsByCourse().map((student) => (
            <tr key={student.student_id}>
              <td className="student-name">
                <Link to={`/student-details/${student.student_id}`}>
                  {student.firstname} {student.lastname}
                </Link>
              </td>
              <td>{student.email}</td>
              <td>{student.number}</td>
              <td>{student.gender}</td>
              <td>
                {courses.find(
                  (course) => course.course_id === student.course_id
                )?.course_name || "Not enrolled"}
              </td>
              <td>
                <Link
                  to={`/edit-student/${student.student_id}`}
                  className="btn1-edit"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(student.student_id)}
                  className="btn1-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
