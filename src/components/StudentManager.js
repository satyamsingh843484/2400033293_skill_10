import React, { useState } from 'react';
import './StudentManager.css';

const COURSES = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Data Science',
];

const INITIAL_STUDENTS = [
  { id: '101', name: 'Alice Johnson', course: 'Computer Science' },
  { id: '102', name: 'Bob Smith',     course: 'Mathematics' },
  { id: '103', name: 'Carol White',   course: 'Physics' },
];

const EMPTY_FORM = { id: '', name: '', course: '' };

function StudentManager() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [newStudent, setNewStudent] = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState({});
  const [flash, setFlash]       = useState(null);
  const [search, setSearch]     = useState('');
  const [sortField, setSortField] = useState('id');

  const showFlash = (msg, type = 'success') => {
    setFlash({ msg, type });
    setTimeout(() => setFlash(null), 2800);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!newStudent.id.trim())
      errs.id = 'ID is required';
    else if (students.some((s) => s.id === newStudent.id.trim()))
      errs.id = 'ID already exists';
    if (!newStudent.name.trim() || newStudent.name.trim().length < 2)
      errs.name = 'Name must be at least 2 characters';
    if (!newStudent.course.trim())
      errs.course = 'Course is required';
    return errs;
  };

  const handleAdd = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const student = {
      id:     newStudent.id.trim(),
      name:   newStudent.name.trim(),
      course: newStudent.course.trim(),
    };
    setStudents((prev) => [...prev, student]);
    setNewStudent(EMPTY_FORM);
    setErrors({});
    showFlash(`Student "${student.name}" added successfully.`);
  };

  const handleDelete = (id) => {
    const target = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showFlash(`Student "${target.name}" removed.`, 'info');
  };

  const handleClear = () => {
    setNewStudent(EMPTY_FORM);
    setErrors({});
  };

  const displayed = students
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.course.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'id')     return a.id.localeCompare(b.id, undefined, { numeric: true });
      if (sortField === 'name')   return a.name.localeCompare(b.name);
      if (sortField === 'course') return a.course.localeCompare(b.course);
      return 0;
    });

  return (
    <div className="manager">

      {flash && (
        <div className={`flash flash-${flash.type}`}>{flash.msg}</div>
      )}

      <section className="form-card">
        <h2>Add New Student</h2>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="id">Student ID</label>
            <input
              id="id"
              name="id"
              type="text"
              value={newStudent.id}
              onChange={handleChange}
              placeholder="e.g. 104"
              className={errors.id ? 'input-error' : ''}
            />
            {errors.id && <span className="err-msg">{errors.id}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={newStudent.name}
              onChange={handleChange}
              placeholder="e.g. David Brown"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="err-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="course">Course</label>
            <select
              id="course"
              name="course"
              value={newStudent.course}
              onChange={handleChange}
              className={errors.course ? 'input-error' : ''}
            >
              <option value="">— Select a course —</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.course && <span className="err-msg">{errors.course}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            + Add Student
          </button>
          <button className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
        </div>
      </section>

      <section className="list-card">
        <div className="list-header">
          <h2>
            Student Records
            <span className="count-badge">{students.length}</span>
          </h2>
          <div className="list-controls">
            <input
              type="text"
              className="search-input"
              placeholder="Search by ID, name or course…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="sort-select"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="id">Sort by ID</option>
              <option value="name">Sort by Name</option>
              <option value="course">Sort by Course</option>
            </select>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎓</span>
            <p>No students yet. Add one above!</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>No students match your search.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((student, index) => (
                  <tr key={student.id}>
                    <td className="row-num">{index + 1}</td>
                    <td><span className="id-badge">{student.id}</span></td>
                    <td className="name-cell">{student.name}</td>
                    <td><span className="course-badge">{student.course}</span></td>
                    <td>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {students.length > 0 && (
          <div className="list-footer">
            Showing {displayed.length} of {students.length} student{students.length !== 1 ? 's' : ''}
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentManager;
