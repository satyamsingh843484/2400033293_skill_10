import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders app header', () => {
  render(<App />);
  expect(screen.getByText(/React State Management/i)).toBeInTheDocument();
});

test('renders initial students', () => {
  render(<App />);
  expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  expect(screen.getByText('Bob Smith')).toBeInTheDocument();
  expect(screen.getByText('Carol White')).toBeInTheDocument();
});

test('shows empty message when all students deleted', () => {
  render(<App />);
  const deleteButtons = screen.getAllByText('Delete');
  deleteButtons.forEach((btn) => fireEvent.click(btn));
  expect(screen.getByText(/No students yet/i)).toBeInTheDocument();
});

test('adds a new student', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/Student ID/i), { target: { value: '999' } });
  fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
  fireEvent.change(screen.getByLabelText(/Course/i), { target: { value: 'Physics' } });
  fireEvent.click(screen.getByText(/\+ Add Student/i));
  expect(screen.getByText('Test User')).toBeInTheDocument();
});

test('shows validation error for duplicate ID', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/Student ID/i), { target: { value: '101' } });
  fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Dup User' } });
  fireEvent.change(screen.getByLabelText(/Course/i), { target: { value: 'Physics' } });
  fireEvent.click(screen.getByText(/\+ Add Student/i));
  expect(screen.getByText(/ID already exists/i)).toBeInTheDocument();
});
