import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renderes title', () => {
  const blog = {
    title: 'test adrian',
    author: 'adrian',
    url: 'none',
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText('test adrian');
  expect(element).toBeDefined();
});

test('does not renderes url by default', () => {
  const blog = {
    title: 'test adrian',
    author: 'adrian',
    url: 'none',
  };

  const { container } = render(<Blog blog={blog} />);

  const span = container.querySelector('.urlSpan');
  expect(span).toBeNull();
});

test('URL rendered after clicking the show details button', async () => {
  const blog = {
    title: 'test adrian',
    author: 'adrian',
    url: 'URL is shown',
  };

  const mockHandler = vi.fn();

  const { container } = render(
    <Blog blog={blog} toggleDetailsVisible={mockHandler} />
  );

  const user = userEvent.setup();
  const showDetailsBtn = screen.getByText('Show Details');
  await user.click(showDetailsBtn);

  const span = container.querySelector('.urlSpan');
  expect(span).toHaveTextContent('URL is shown');
});

test('Props of calling likes twice works fine', async () => {
  const blog = {
    title: 'test adrian',
    author: 'adrian',
    url: 'URL is shown',
    likes: 0,
  };

  const mockHandler = vi.fn();

  render(
    <Blog
      blog={blog}
      toggleDetailsVisible={mockHandler}
      increaseBlogLikes={mockHandler}
    />
  );

  const user = userEvent.setup();
  const showDetailsBtn = screen.getByText('Show Details');
  await user.click(showDetailsBtn);

  const increaseLikesBtn = screen.getByText('Like');
  await user.click(increaseLikesBtn);
  await user.click(increaseLikesBtn);

  expect(mockHandler.mock.calls).toHaveLength(3);
});
