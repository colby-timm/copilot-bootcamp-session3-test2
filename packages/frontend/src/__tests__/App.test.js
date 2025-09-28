import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock server to intercept API requests
const server = setupServer(
  // GET /api/items handler
  rest.get('/api/items', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Test Item 1', priority: 'P3', created_at: '2023-01-01T00:00:00.000Z' },
        { id: 2, name: 'Test Item 2', priority: 'P3', created_at: '2023-01-02T00:00:00.000Z' },
      ])
    );
  }),
  
  // POST /api/items handler
  rest.post('/api/items', (req, res, ctx) => {
    const { name, priority = 'P3' } = req.body;
    
    if (!name || name.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Item name is required' })
      );
    }
    
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        name,
        priority,
        created_at: new Date().toISOString(),
      })
    );
  }),

  // PUT /api/items/:id handler
  rest.put('/api/items/:id', (req, res, ctx) => {
    const { id } = req.params;
    const { priority } = req.body;
    
    if (!priority || !['P1', 'P2', 'P3'].includes(priority)) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Priority must be P1, P2, or P3' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id),
        name: `Test Item ${id}`,
        priority,
        created_at: '2023-01-01T00:00:00.000Z',
      })
    );
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('React Frontend with Node Backend')).toBeInTheDocument();
    expect(screen.getByText('Connected to in-memory database')).toBeInTheDocument();
  });

  test('loads and displays items', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Initially shows loading state
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
  });

  test('adds a new item', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Fill in the form and submit
    const input = screen.getByPlaceholderText('Enter New Item');
    await act(async () => {
      await user.type(input, 'New Test Item');
    });
    
    const submitButton = screen.getByText('Add');
    await act(async () => {
      await user.click(submitButton);
    });
    
    // Check that the new item appears
    await waitFor(() => {
      expect(screen.getByText('New Test Item')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no items', async () => {
    // Override the default handler to return empty array
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText('No items found. Add some!')).toBeInTheDocument();
    });
  });

  test('displays priority fields with default P3', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Check that all items have P3 priority selected by default
    const p3Labels = screen.getAllByText('P3');
    const selectedP3s = p3Labels.filter(label => label.classList.contains('selected'));
    expect(selectedP3s.length).toBeGreaterThan(0);
  });

  test('allows changing priority for existing items', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Click on P1 for the first item
    const p1Radios = screen.getAllByDisplayValue('P1');
    await act(async () => {
      await user.click(p1Radios[1]); // Skip the first one which is for new item form
    });
    
    // Check that P1 is now selected
    await waitFor(() => {
      const p1Labels = screen.getAllByText('P1');
      const selectedP1s = p1Labels.filter(label => label.classList.contains('selected'));
      expect(selectedP1s.length).toBeGreaterThan(0);
    });
  });

  test('new item priority defaults to P3', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Check that P3 is selected by default in the form
    const newItemP3Radio = screen.getByDisplayValue('P3');
    expect(newItemP3Radio).toBeChecked();
    
    // Check that P3 label is selected
    const p3Labels = screen.getAllByText('P3');
    const formP3Label = p3Labels.find(label => 
      label.closest('.add-item-section') !== null
    );
    expect(formP3Label).toHaveClass('selected');
  });
});