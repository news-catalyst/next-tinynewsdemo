import { render, screen, waitFor } from '@testing-library/react';
import AddSection from '../../pages/_sites/[site]/tinycms/sections/add.js';
import { hasuraCreateSection } from '../../lib/section.js';
import userEvent from '@testing-library/user-event';

// Mocking a child component that we don't need to render for these tests
jest.mock('../../components/AdminLayout', () => 'admin-layout');

describe.only('Add Section page', () => {
  it('renders a form input for title', () => {
    render(<AddSection />);

    let titleTextBox = screen.getByRole('textbox', {
      name: /title/i,
    });

    expect(titleTextBox).toBeInTheDocument();
  });

  it('shows an error when title is blank', async () => {
    const user = userEvent.setup();
    render(<AddSection />);
    await user.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      screen.getByRole('alert');
    });

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Error: Title is required.'
    );
  });

  it('shows an error when title is only whitespace', async () => {
    const user = userEvent.setup();
    render(<AddSection />);
    const titleInput = screen.getByRole('textbox', {
      name: /title/i,
    });
    await user.type(titleInput, ' ');
    await user.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      screen.getByRole('alert');
    });

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Error: Title is required.'
    );
  });

  it('shows an error when user enters "archive" for title', async () => {
    const user = userEvent.setup();
    render(<AddSection />);
    const titleInput = screen.getByRole('textbox', {
      name: /title/i,
    });
    // case shouldn't matter and whitespace should be trimmed
    await user.type(titleInput, ' Archive');
    await user.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      screen.getByRole('alert');
    });

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Error: "Archive" is reserved for a default page. Please enter a different title.'
    );
  });
});
