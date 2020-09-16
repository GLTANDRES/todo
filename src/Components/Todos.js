import React, { Component } from "react";
import db from "../FirestoreConfig";
import { Table, Button, Row, Col, InputGroup, Input, Fade } from "reactstrap";

export default class Todos extends Component {
  state = {
    items: [],
    inputValue: "",
    edit: false,
    id: "",
    fadeln: false,
    message: "",
  };

  componentDidMount() {
    db.collection("todos").onSnapshot(
      (snapShots) => {
        this.setState({
          items: snapShots.docs.map((doc) => {
            return { id: doc.id, data: doc.data() };
          }),
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  changeValue = (e) => {
    this.setState({
      inputValue: e.target.value,
    });
  };
  action = () => {
    const { inputValue, edit } = this.state;

    !edit
      ? db
          .collection("todos")
          .add({
            item: inputValue,
          })
          .then(() => {
            this.message("Agregado");
          })
          .catch(() => {
            this.message("Error");
          })
      : this.update();
  };

  getTodo = (id) => {
    let docRef = db.collection("todos").doc(id);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({
            inputValue: doc.data().item,
            edit: true,
            id: doc.id,
          });
        } else {
          console.log("El documento no existe");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  update = () => {
    const { id, inputValue } = this.state;

    db.collection("todos")
      .doc(id)
      .update({
        item: inputValue,
      })
      .then(() => {
        this.message("Actualizado");
        this.setState({
          edit: false,
        });
      })
      .catch((error) => {
        this.message("Error");
      });
  };

  deleteltem = (id) => {
    db.collection("todos").doc(id).delete();
  };

  message = (message) => {
    this.setState({
      inputValue: "",
      fadeln: true,
      message: message,
    });
    setTimeout(() => {
      this.setState({
        fadeln: false,
        message: "",
      });
    }, 3000);
  };
  render() {
    const { items, inputValue } = this.state;
    return (
      <div>
        <Row>
          <Col xs="10">
            <InputGroup>
              <Input
                placeholder="Agregar un nuevo item "
                value={inputValue}
                onChange={this.changeValue}
              />
            </InputGroup>
          </Col>

          <Col xs="2">
            <div className="text-right">
              <Button color="info" onClick={this.action}>
                {this.state.edit ? "Editar" : "Agregar"}
              </Button>
            </div>
          </Col>
        </Row>
        <Fade
          in={this.state.fadeln}
          tag="h6"
          className="mt-3 text-center text-success"
        >
          {this.state.message}
        </Fade>
        <br />
        <Table hover className="text-center">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {items && items !== undefined
              ? items.map((item, key) => (
                  <tr key={key}>
                    <td>{item.data.item}</td>
                    <td>
                      <Button
                        color="warning"
                        onClick={() => this.getTodo(item.id)}
                      >
                        Editar
                      </Button>
                    </td>
                    <td>
                      <Button
                        color="danger"
                        onClick={() => this.deleteltem(item.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </Table>
      </div>
    );
  }
}
