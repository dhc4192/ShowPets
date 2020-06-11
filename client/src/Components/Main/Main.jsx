import React, { Component } from "react";
import { Route } from "react-router-dom";
import {
  getAllPets,
  createPet,
  deletePet,
  updatePet,
} from "../../services/pets";
import { getCategories } from "../../services/categories";
import SignIn from "../SignIn/SignIn";
import SignUp from "../SignUp/SignUp";
import CreatePet from "../CRUD/CreatePet";
import Pets from "../Pets/Pets";
import Pet from "../Pet/Pet";
import Categories from "../Categories/Categories";
import UpdatePet from "../CRUD/UpdatePet";

export default class Main extends Component {
  state = {
    pets: [],
    categories: [],
  };

  async componentDidMount() {
    const pets = await getAllPets();
    this.setState({ pets });
    this.getAllCategories();
  }

  getAllCategories = async () => {
    const categories = await getCategories();
    this.setState({ categories });
  };

  addPet = async (petData) => {
    const newPet = await createPet(petData);
    this.setState((prevState) => ({
      pets: [...prevState.pets, newPet],
    }));
  };

  putPet = async (id, petData) => {
    const updatedPet = await updatePet(id, petData);
    this.setState((prevState) => ({
      pets: prevState.pets.map((pet) => (pet.id === id ? updatedPet : pet)),
    }));
  };

  destroyPet = async (id) => {
    await deletePet(id);
    this.setState((prevState) => ({
      pets: prevState.pets.filter((pet) => pet.id !== id),
    }));
  };

  render() {
    return (
      <main>
        <Route
          exact
          path="/"
          render={(props) => (
            <SignIn
              {...props}
              handleSignInSubmit={this.props.handleSignInSubmit}
            />
          )}
        />
        <Route
          path="/signup"
          render={(props) => (
            <SignUp
              {...props}
              handleSignUpSubmit={this.props.handleSignUpSubmit}
            />
          )}
        />
        <Route
          path="/home"
          render={() => <Categories categories={this.state.categories} />}
        />
        <Route
          exact
          path="/home"
          render={(props) => <Pets {...props} pets={this.state.pets} />}
        />
        <Route
          exact
          path="/pets/:id"
          render={(props) => (
            <Pet
              {...props}
              currentUser={this.props.currentUser}
              destroyPet={this.destroyPet}
            />
          )}
        />
        <Route
          path="/add/pet"
          render={(props) => (
            <CreatePet
              {...props}
              addPet={this.addPet}
              categories={this.state.categories}
            />
          )}
        />
        <Route
          path="/pets/:id/edit"
          render={(props) => {
            return (
              <UpdatePet
                {...props}
                putPet={this.putPet}
                categories={this.state.categories}
              />
            );
          }}
        />
      </main>
    );
  }
}