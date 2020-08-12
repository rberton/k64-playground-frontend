import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { create, act } from "react-test-renderer";
import { GraphQLError } from "graphql";
import GET_USER from "../../resources/graphql/query/user";
import Index from "../../pages/index";

const nullMocks = [];

const errorMocks = [
  {
    request: {
      query: GET_USER,
      variables: {
        userId: "",
      },
    },
    result: {
      data: {
        user: null,
      },
      errors: [new GraphQLError("Error !")],
    },
  },
];

const finalMocks = [
  {
    request: {
      query: GET_USER,
      variables: {
        userId: "",
      },
    },
    result: {
      data: {
        user: null,
      },
    },
  },
];

describe("Homepage tests", () => {
  it("renders correctly", async () => {
    let component;
    await act(async () => {
      component = create(
        <MockedProvider mocks={finalMocks} addTypename={false}>
          <Index />
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  // FIXME:BEGIN:
  // it("should render loading state initially and should show error UI", async () => {
  //   let component;

  // act(() => {
  //   component = create(
  //     <MockedProvider mocks={nullMocks}>
  //       <Index />
  //     </MockedProvider>
  //   );
  // });
  // expect(component.toJSON().children).toContain("Loading...");

  // await act(async () => {
  //   component = create(
  //     <MockedProvider mocks={errorMocks} addTypename={false}>
  //       <Index />
  //     </MockedProvider>
  //   );

  //   await new Promise((resolve, reject) => setTimeout(reject, 0));
  // });
  // expect(component.toJSON().children).toContain("Error !");
  // });
  // FIXME:END:
});
