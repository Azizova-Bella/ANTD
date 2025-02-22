import React, { useEffect, useState } from "react";
import { Card, Col, Row, Input, Button, Select, Flex } from "antd";
import axios from "axios";
import "./App.css"

const API = "https://679904c4be2191d708b1b454.mockapi.io/table/users/Todolist";

const App = () => {
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const getUsers = async () => {
    try {
      const { data } = await axios.get(API);
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addUser = async () => {
    if (!title.trim() || !description.trim()) return;
    try {
      const { data } = await axios.post(API, {
        title,
        description,
        status: false,
      });
      setUsers([...users, data]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (user) => {
    setEditingId(user.id);
    setTitle(user.title);
    setDescription(user.description);
  };

  const updateUser = async () => {
    if (!title.trim() || !description.trim()) return;
    try {
      await axios.put(`${API}/${editingId}`, { title, description });
      setUsers(
        users.map((user) =>
          user.id === editingId ? { ...user, title, description } : user
        )
      );
      setEditingId(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const { data } = await axios.put(`${API}/${id}`, {
        status: !currentStatus,
      });
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, status: data.status } : user
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (filter === "NOT DONE") return !user.status;
    if (filter === "DONE") return user.status;
    return true;
  });

  const searchedUsers = filteredUsers.filter((user) =>
    user.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>{editingId ? "Edit Task" : "Add Task"}</h2>
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      {editingId ? (
        <Button type="primary" onClick={updateUser}>
          Save Changes
        </Button>
      ) : (
        <Button type="primary" onClick={addUser}>
          Add
        </Button>
      )}

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "200px" }}
        />
        <Select
          value={filter}
          onChange={(value) => setFilter(value)}
          style={{ width: "150px" }}
        >
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="NOT DONE">NOT DONE</Select.Option>
          <Select.Option value="DONE">DONE</Select.Option>
        </Select>
      </div>

      <Row
  gutter={16}
  style={{
    marginTop: "50px",
    marginBottom: "100px",
  }}
  justify="center"
>
  {searchedUsers.map((e) => (
    <Col key={e.id} xs={24} sm={12} md={8}>
      <Card title={e.title} variant="borderless">
        <p>{e.description}</p>
        <div
          className="actions"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
          }}
        >
          <Button
            type={e.status ? "primary" : "default"}
            onClick={() => toggleStatus(e.id, e.status)}
          >
            {e.status ? "Done" : "Not Done"}
          </Button>
          <Button danger onClick={() => deleteUser(e.id)}>Delete</Button>
          <Button onClick={() => startEditing(e)}>Edit</Button>
        </div>
      </Card>
    </Col>
  ))}
</Row>

    </div>
  );
};

export default App;
