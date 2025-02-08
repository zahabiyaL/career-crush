import React, { useState } from 'react';
import { MdBorderColor } from 'react-icons/md';

function Features() {
  // State to track the flip status of each card
  const [flipped, setFlipped] = useState([false, false, false]);

  const handleFlip = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

  const features = [
    {
      title: 'Customized Job Matches',
      description: 'Find jobs that match your unique preferences and experience.',
    },
    {
      title: 'Simple Swipe-to-Apply',
      description:
        'Swipe right to apply or left to skip, just like you would with your favorite apps!',
    },
    {
      title: 'Time Management',
      description:
        'Optimize your job search with features designed to save you time and effort.',
    },
  ];

  // Inline styles for the flip card effect
  const cardStyles = {
    perspective: '1000px',
    marginBottom: '2rem',
  };

  const flipCardStyles = (flipped) => ({
    width: '100%',
    height: '50vh', // Keep the height at 50vh
    transformStyle: 'preserve-3d',
    transition: 'transform 0.5s',
    cursor: 'pointer',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
  });

  const flipCardInnerStyles = {
    position: 'relative',
    transformStyle: 'preserve-3d',
    height: '100%',
    transition: 'transform 0.5s',
  };

  const flipCardFrontStyles = {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: '#153243',
    borderRadius: '8px',
    border: '2px solid',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
  };

  const flipCardBackStyles = {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CAF0F8', // Blue color for back
    color: 'black',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    transform: 'rotateY(180deg)',
  };

  return (
    <div className="flex items-center justify-center h-screen text-cc-dblue">
      <div className="text-center p-6">
        <h1 className="text-4xl font-glook mb-4">App Features</h1>
        <p className="text-xl font-glook mb-6">
          Welcome to our app! We offer a range of features to help you get the most out of your job hunt. Below are some key highlights.
        </p>

        {/* Grid of Flip Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative w-full mx-auto"
              style={cardStyles} // Applying perspective here
            >
              {/* Flip Card */}
              <div
                className="flip-card"
                style={flipCardStyles(flipped[index])}
                onClick={() => handleFlip(index)}
              >
                <div className="flip-card-inner" style={flipCardInnerStyles}>
                  {/* Front of the Card */}
                  <div className="flip-card-front" style={flipCardFrontStyles}>
                    <p className="text-lg font-glook">{feature.title}</p>
                  </div>
                  {/* Back of the Card */}
                  <div className="flip-card-back" style={flipCardBackStyles}>
                    <p className="text-lg font-glook">{feature.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-glook mt-6 mb-3 text-cc-lblue">Get Started Today</h2>
        <p className="text-lg font-glook bg-cc-lblue border rounded-2xl">
          It's time to experience the power of our app. Sign up today and start enjoying all the benefits!
        </p>
      </div>
    </div>
  );
}

export default Features;
