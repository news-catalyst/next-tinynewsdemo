import { render, screen } from '@testing-library/react';
import AddSection from '../../pages/_sites/[site]/tinycms/sections/add.js';

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
});
