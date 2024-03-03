export default function Follow(props) {
  const { followers, following } = props;
  return (
    <div className="follow">
      <div>
        <h5>following</h5>
        <p>{following}</p>
      </div>
      <div>
        <h5>followers</h5>
        <p>{followers}</p>
      </div>
    </div>
  );
}
