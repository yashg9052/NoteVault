import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  it('should render search input field', () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search by title or content...');
    expect(input).toBeInTheDocument();
  });

  it('should update input value when user types', () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search by title or content...');
    fireEvent.change(input, { target: { value: 'test note' } });
    
    expect(input.value).toBe('test note');
  });

  it('should show clear button when input has value', async () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search by title or content...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    await waitFor(() => {
      const clearButton = screen.getByText('✕');
      expect(clearButton).toBeInTheDocument();
    });
  });

  it('should clear input when clear button is clicked', async () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search by title or content...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    await waitFor(() => {
      const clearButton = screen.getByText('✕');
      fireEvent.click(clearButton);
    });
    
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('should call onSearch callback with debounced value', async () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search by title or content...');
    fireEvent.change(input, { target: { value: 'search text' } });
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('search text');
    }, { timeout: 500 });
  });
});
