import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getHomeworkById,
  updateHomework,
  getAttendanceById,
  updateAttendance,
} from "../../services/ApiService";

const StudentDetails = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [state, setState] = useState({
    homework: {
      studentId: studentId,
      assignmentName: "",
      description: "",
      dueDate: "",
      isCompleted: false,
      completionDate: "",
      grade: "",
    },
    attendance: {
      studentId: studentId,
      attendanceDate: "",
      isPresent: false,
    },
    errors: {},
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [homeworkData, attendanceData] = await Promise.all([
          getHomeworkById(studentId),
          getAttendanceById(studentId),
        ]);
        setState((prevState) => ({
          ...prevState,
          homework: {
            ...prevState.homework,
            ...homeworkData,
            studentId: studentId,
          },
          attendance: {
            ...prevState.attendance,
            ...attendanceData,
            studentId: studentId,
          },
          loading: false,
        }));
      } catch (error) {
        console.error("Failed to fetch details:", error);
        setState((prevState) => ({
          ...prevState,
          error: "Failed to fetch student details",
          loading: false,
        }));
      }
    };

    fetchDetails();
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const isHomeworkField = Object.hasOwnProperty.call(state.homework, name);
    setState((prevState) => ({
      ...prevState,
      [isHomeworkField ? "homework" : "attendance"]: {
        ...prevState[isHomeworkField ? "homework" : "attendance"],
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;
    const fields = state.homework;

    if (!fields.assignmentName) {
      formIsValid = false;
      errors["assignmentName"] = "Assignment name is required.";
    }

    if (!fields.description) {
      formIsValid = false;
      errors["description"] = "Description is required.";
    }

    if (!fields.dueDate) {
      formIsValid = false;
      errors["dueDate"] = "Due date is required.";
    }

    if (!fields.grade) {
      formIsValid = false;
      errors["grade"] = "Grade is required.";
    }

    setState((prevState) => ({
      ...prevState,
      errors: errors,
    }));

    return formIsValid;
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const {
      assignmentName,
      description,
      dueDate,
      isCompleted,
      completionDate,
      grade,
    } = state.homework;

    const homeworkPayload = {
      student_id: studentId,
      assignment_name: assignmentName,
      description: description,
      due_date: dueDate,
      is_completed: isCompleted ? 1 : 0,
      completion_date: isCompleted ? completionDate : null,
      grade: grade,
    };

    const attendancePayload = {
      student_id: studentId,
      attendance_date: state.attendance.attendanceDate,
      is_present: state.attendance.isPresent ? 1 : 0,
    };

    try {
      await updateHomework(studentId, homeworkPayload);
      alert("Homework updated successfully!");
      navigate("/sidebar/students");
    } catch (error) {
      console.error("Save failed:", error);
      alert(`Error during save: ${error.message}`);

      return;
    }

    try {
      await updateAttendance(studentId, attendancePayload);
      alert("Attendance updated successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert(`Error during save: ${error.message}`);
    }
  };

  if (state.loading) return <div>Loading...</div>;
  if (state.error) return <div>Error: {state.error}</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Link className="btn" to="/sidebar/students">
        Back to List
      </Link>

      <h1 style={{ textAlign: "center" }}>Student Details</h1>
      <form onSubmit={handleSave}>
        <label>Attendance Date:</label>
        <input
          type="date"
          name="attendanceDate"
          value={state.attendance.attendanceDate}
          onChange={handleChange}
        />
        <label>Present:</label>
        <input
          type="checkbox"
          name="isPresent"
          checked={state.attendance.isPresent}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Assignment Name:</label>
        <input
          type="text"
          name="assignmentName"
          value={state.homework.assignmentName}
          onChange={handleChange}
        />
        {state.errors.assignmentName && (
          <div>{state.errors.assignmentName}</div>
        )}
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={state.homework.description}
          onChange={handleChange}
        />
        {state.errors.description && <div>{state.errors.description}</div>}
        <label>Due Date:</label>
        <input
          type="date"
          name="dueDate"
          value={state.homework.dueDate}
          onChange={handleChange}
        />
        {state.errors.dueDate && <div>{state.errors.dueDate}</div>}
        <label>Completed:</label>
        <input
          type="checkbox"
          name="isCompleted"
          checked={state.homework.isCompleted}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Completion Date:</label>
        <input
          type="date"
          name="completionDate"
          value={state.homework.completionDate}
          onChange={handleChange}
          disabled={!state.homework.isCompleted}
        />
        <label>Grade:</label>
        <select
          name="grade"
          value={state.homework.grade}
          onChange={handleChange}
        >
          <option value="">Select grade</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
        {state.errors.grade && <div>{state.errors.grade}</div>}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default StudentDetails;
