function StudentSignUp() {
    return (
      <div>
        <h2>Student Sign-Up Page</h2>
        <p>Here students can create their accounts.</p>
        <form>
          <label>Name:</label>
          <input type="text" placeholder="Enter your name" />
          <br />
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" />
          <br />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  }
  
  export default StudentSignUp;
  