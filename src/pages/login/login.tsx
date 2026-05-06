const LoginPage = () => {
  return (
    <div>
      <h1>Sign in</h1>
      <form>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <input type="checkbox" id="remember" />
        <label htmlFor="remember">Remember me</label>
        <button type="submit">Login</button>
        <a href="/forgot-password">Forgot password?</a>
      </form>
    </div>
  );
};

export default LoginPage;
