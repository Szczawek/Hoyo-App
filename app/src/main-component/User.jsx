import Login from "../account/Login";
import Menu from "../profile/Menu";

export default function User({ user, session, menu, comments }) {
  return (
    <section className="user">
      <div className="bg-img">
        <header className="profile">
          <div className="avatar">
            <img className="big" src={user["avatar"]} alt="profile image" />
          </div>
          <div className="account_description">
            <h2>{user["nick"]}</h2>
            <p>{user["about"]}</p>
          </div>
        </header>
      </div>
      <div className="only_user_comments">
        {!comments ? (
          <p>empty table</p>
        ) : (
          comments.map((e) => {
            return (
              <div key={e["id"]} className="comment">
                <header>
                  <div className="comment_info">
                    <div className="avatar">
                      <img
                        className="medium"
                        src={user["avatar"]}
                        alt="avatar"
                      />
                    </div>
                    <div>
                      <h3>{user["nick"]}</h3>
                      <p className="date">{e["date"]}</p>
                    </div>
                  </div>
                </header>
                <div className="content">
                  <p>{e["content"]}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {menu && <Menu />}
      {!session && <Login uncloseable={true}></Login>}
    </section>
  );
}
