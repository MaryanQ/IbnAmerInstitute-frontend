import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AboutUs from "./components/views/aboutUs/AboutUs";
import ContactUs from "./components/views/contactUs/ContactUs";
import Elever from "./components/views/students/Elever";
import Udenadslaering from "./components/views/courses/Udenadslaering";
import HomePage from "./components/views/home/HomePage";
import Ijazah from "./components/views/courses/Ijazah";
import Tajweed from "./components/views/courses/Tajweed";
import Teachers from "./components/views/teacher/Teachers";
import Sidebar from "./dashboard/sidebar";
import StudentList from "./components/list/studentList";

import AddStudent from "./forms/addStudent";
import EditStudent from "./forms/editStudent";
import CoursesWithClasses from "./components/list/courseList";
import AddCourse from "./forms/addCourse";
import EditCourse from "./forms/editCourse";
import StudentDetails from "./components/list/studentDetails";
import Login from "./services/Login";

const App = () => {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/elever" element={<Elever />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/udenadslaering" element={<Udenadslaering />} />
          <Route path="/ijazah" element={<Ijazah />} />
          <Route path="/tajweed" element={<Tajweed />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/sidebar/students" element={<StudentList />} />
          <Route path="/add_student" element={<AddStudent />} />
          <Route path="/edit-student/:studentId" element={<EditStudent />} />
          <Route path="/edit-course/:courseId" element={<EditCourse />} />
          <Route
            path="/student-details/:studentId"
            element={<StudentDetails />}
          />

          <Route path="/sidebar/add_course" element={<AddCourse />} />
          <Route path="/sidebar/course" element={<CoursesWithClasses />} />
          <Route path="/sidebar" element={<Sidebar />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
