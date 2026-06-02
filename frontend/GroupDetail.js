// src/User/GroupMembers.js
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserFooter from "./UserFooter";
export default function GroupMembers() {
  const { groupId } = useParams();
  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        //  fetch all groups
        const res1 = await fetch(`http://localhost:4000/groups`);
        const allGroups = await res1.json();

        // find the one we want
        const g = allGroups.find((gr) => String(gr.group_id) === String(groupId));
        setGroup(g);

        // fetch members
        const res2 = await fetch(`http://localhost:4000/group_members/${groupId}`);
        const membersData = await res2.json();

         // for each member, fetch username
        const membersWithNames = await Promise.all(
          membersData.map(async (m) => {
            try {
              const resUser = await fetch(`http://localhost:4000/users/${m.user_id}`);
              const userData = await resUser.json();
              
              console.log("User API response for", m.user_id, userData);
              return { ...m, username: userData.user_name }; // attach username
            } catch {
              return { ...m, username: "Unknown" };
            }
          })
        );

        setMembers(membersWithNames);
      } catch (err) {
        console.error("Failed to load group details/members", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [groupId]);

  if (loading) return <p>Loading group details...</p>;

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar */}
        <UserSidebar />

        {/* Main Content */}
        <div className="col-10 p-4 overflow-auto">
          <Outlet />
          <div>
            <h3>
              👥 Group Members (Group #{groupId} - {group?.group_name || "Unnamed"})
            </h3>

            {members.length === 0 ? (
              <p>No members yet.</p>
            ) : (
              <ul className="list-group">
                {members.map((m) => (
                  <li key={m.member_id} className="list-group-item">
                    User ID: {m.user_id} — <strong>{m.user_name}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

      </div>
      <UserFooter />
    </div>
      
  );
}
