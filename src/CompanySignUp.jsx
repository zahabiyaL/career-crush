function CompanySignUp() {
    return (
      <div>
        <h2>Company Sign-Up Page</h2>
        <p>Here companies can create their accounts.</p>
        <form>
          <label>Company Name:</label>
          <input type="text" placeholder="Enter your company name" />
          <br />
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" />
          <br />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  }
  
  export default CompanySignUp;
  