export default function Follow(props) {
  const { followers, following } = props;
  return (
    <ul className="follow">
      <li>
        <h3>following</h3>
        <p>{following}</p>
      </li>
      <li>
        <h4>followers</h4>
        <p>{followers}</p>
      </li>
    </ul>
  );
}
