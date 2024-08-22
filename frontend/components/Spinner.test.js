// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from "react"
import { render } from "@testing-library/react"
import Spinner from "./Spinner"


test('renders spinner when spinnerOn is truthy', () => {
  const { getByText } = render(<Spinner spinnerOn={true} on={true}/>);
  expect(getByText('Please wait...')).not.toBeNull();
})

test('doesnt render when spinnerOn is falsy', () => {
  const { queryByText } = render(<Spinner spinnerOn={false} on={false}/>)
  expect(queryByText('Please wait...')).toBeNull();
})
