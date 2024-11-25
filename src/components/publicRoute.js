function PublicRoute(props) {
  if (!localStorage.getItem("token")) {
    return props.children;
  }
}

export default PublicRoute;
