function Features() {
  return (
    <div className="flex items-center justify-center h-screen text-gray-800">
      <div className="text-center p-6">
        <h1 className="text-4xl font-bold mb-4">App Features</h1>
        <p className="text-xl mb-6">
          Welcome to our app! We offer a range of features to help you get the most out of your job hunt. Below are some key highlights.
        </p>
        
        <h2 className="text-2xl font-semibold mb-3">Why Choose Us?</h2>
        <p className="text-lg mb-6">
          Our platform is built with the user in mind, offering intuitive tools and a seamless interface. Here are some reasons why you should use our app:
        </p>
        
        {/* List of features */}
        <ul className="list-disc pl-5 space-y-3 text-lg">
          <li>Feature 1: Customized Job Matches</li>
          <li>Feature 2: Make job searching as simple as a swipe. Swipe right to apply or left to skip, just like you would with your favorite apps!</li>
          <li>Feature 3: Make the most out of your time</li>
        </ul>

        {/* Another section */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">Get Started Today</h2>
        <p className="text-lg">
          It's time to experience the power of our app. Sign up today and start enjoying all the benefits!
        </p>
      </div>
    </div>
  );
}

export default Features;