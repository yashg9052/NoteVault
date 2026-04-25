import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NoteCard from './NoteCard';

describe('NoteCard Component', () => {
  const mockNote = {
    id: '1',
    title: 'Test Note',
    content: 'This is test content for the note',
    category: 'Work',
    createdAt: new Date('2024-01-15').toISOString(),
  };

  const mockCallbacks = {
    onView: jest.fn(),
    onEdit: jest.fn(),
    onTransfer: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render note title', () => {
    render(<NoteCard note={mockNote} {...mockCallbacks} />);
    
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  it('should render note content preview', () => {
    render(<NoteCard note={mockNote} {...mockCallbacks} />);
    
    expect(screen.getByText('This is test content for the note')).toBeInTheDocument();
  });

  it('should render category badge', () => {
    render(<NoteCard note={mockNote} {...mockCallbacks} />);
    
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('should render formatted date', () => {
    render(<NoteCard note={mockNote} {...mockCallbacks} />);
    
    expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
  });

  it('should call onView when card is clicked', () => {
    const { container } = render(<NoteCard note={mockNote} {...mockCallbacks} />);
    
    const card = container.firstChild;
    fireEvent.click(card);
    
    expect(mockCallbacks.onView).toHaveBeenCalledWith(mockNote);
  });

  it('should call onEdit when edit button is clicked', () => {
    render(<NoteCard note={mockNote} {...mockCallbacks} />);
    
    const editButton = screen.getByTitle('Edit note');
    fireEvent.click(editButton);
    
    expect(mockCallbacks.onEdit).toHaveBeenCalledWith(mockNote);
  });

  it('should call onTransfer when transfer button is clicked', () => {
    render(<NoteCard note={mockNote} {...mockCallbacks} />);
    
    const transferButton = screen.getByTitle('Transfer note');
    fireEvent.click(transferButton);
    
    expect(mockCallbacks.onTransfer).toHaveBeenCalledWith(mockNote);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(<NoteCard note={mockNote} {...mockCallbacks} />);
    
    const deleteButton = screen.getByTitle('Delete note');
    fireEvent.click(deleteButton);
    
    expect(mockCallbacks.onDelete).toHaveBeenCalledWith(mockNote);
  });

  it('should not call onView when action buttons are clicked', () => {
    render(<NoteCard note={mockNote} {...mockCallbacks} />);
    
    const editButton = screen.getByTitle('Edit note');
    fireEvent.click(editButton);
    
    expect(mockCallbacks.onView).not.toHaveBeenCalled();
  });

  it('should handle notes without category', () => {
    const noteWithoutCategory = { ...mockNote, category: undefined };
    render(<NoteCard note={noteWithoutCategory} {...mockCallbacks} />);
    
    expect(screen.getByText('OTHER')).toBeInTheDocument();
  });
});
