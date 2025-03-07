import { render, screen } from '@testing-library/react';
import NewBlogForm from './NewBlogForm';
import userEvent from '@testing-library/user-event';

test('<NewBlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<NewBlogForm createBlog={createBlog} />);

  const inputs = screen.getAllByRole('textbox');
  const sendButton = screen.getByText('Create');

  await user.type(inputs[0], 'New Title');
  await user.type(inputs[1], 'New Author');
  await user.type(inputs[2], 'New Url');
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe('New Title');
});
