import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Request = {
  _id: string;
  sender: { name: string };
  status: string;
};

const PendingRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const[isMenuVisible,setIsMenuVisible]=useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get("http://localhost:3000/requests/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);


  type Request = {
    sender: { name: string };
    receiver: string;
    status: string;
    _id: string;
  };
  
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);

  
  
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("jwtToken");

        const response = await fetch("http://localhost:3000/api/requests/pending", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setPendingRequests(data.requests);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchPendingRequests();
  }, []);

  const acceptRequest = async (senderId: string) => {
    try {
      const token = localStorage.getItem("jwtToken");
  
      const response = await fetch("http://localhost:3000/api/requests/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sender: senderId, receiver: "your_user_id" }), // Replace with actual logged-in user ID
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Friend request accepted!");
        setPendingRequests(pendingRequests.filter((req) => req.sender.name !== senderId));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };
  
  const rejectRequest = async (senderId: string) => {
    try {
      const token = localStorage.getItem("jwtToken");
  
      const response = await fetch("http://localhost:3000/api/requests/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sender: senderId, receiver: "your_user_id" }), // Replace with actual logged-in user ID
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Friend request rejected!");
        setPendingRequests(pendingRequests.filter((req) => req.sender.name !== senderId));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };
  

//   const handleAccept = async (requestId: string) => {
//     try {
//       const token = localStorage.getItem("jwtToken");
//       await axios.post(`http://localhost:3000/requests/accept/${requestId}`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setRequests(requests.filter((req) => req._id !== requestId)); // Remove from UI
//     } catch (error) {
//       console.error("Error accepting request:", error);
//     }
//   };

//   const handleDecline = async (requestId: string) => {
//     try {
//       const token = localStorage.getItem("jwtToken");
//       await axios.post(`http://localhost:3000/requests/decline/${requestId}`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setRequests(requests.filter((req) => req._id !== requestId)); // Remove from UI
//     } catch (error) {
//       console.error("Error declining request:", error);
//     }
//   };



  const handlePMenu = () => {
    console.log("Menu clicked");
    setIsMenuVisible((prev) => !prev);
  }

  const handleProfile = () => {
    console.log("Profile clicked");
    navigate("/profile");
  }

  const handlePHome = () => {
    console.log("Home clicked");
    navigate("/home");
  }

  const handlePLogout = () => {

    localStorage.removeItem("jwtToken");
    alert("Logout successful!");
    navigate("/Login");
}


  return (

    
    <div>

<button onClick={handlePMenu} className=" profile-menu-button">
        {isMenuVisible ? "Close Menu" : " Click to Open Menu"}
      </button>

      {isMenuVisible && (
        <div className="sidebar">
          <h2 className="sidebar-title">Menu</h2>
          <ul className="sidebar-list">
            <li className="sidebar-item" onClick={handlePHome}>Home</li>
            <li className="sidebar-item" onClick={handleProfile} >Profile</li>
            <li className="sidebar-item">Requests</li>
            <li className="sidebar-item">Settings</li>
            <li className="sidebar-item" onClick={handlePLogout}>
              Logout
            </li>
          </ul>
        </div>
      )}
      <h2>Pending Requests</h2>
{requests.length === 0 ? (
  <p>No pending requests</p>
) : (
  <ul>
    {requests.map((request) => (
      <li key={request._id}>
        {request.sender.name}
        <button
          onClick={() => acceptRequest(request._id)}
          style={{
            backgroundColor: "green",
            color: "white",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          Accept
        </button>
        <button
          onClick={() => rejectRequest(request._id)}
          style={{
            backgroundColor: "red",
            color: "white",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          Decline
        </button>
      </li>
    ))}
  </ul>
)}


      
    </div>
  );
};

export default PendingRequests;
