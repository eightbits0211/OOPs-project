import React, { useState } from 'react';
import api from '../api/axiosConfig';

const FeedbackSection = ({ productId, initialReviews, refreshData }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await api.post('/api/catalog/feedback', {
            productId,
            user: 'Demo User', 
            rating,
            comment
        });
        setComment('');
        alert('Review Submitted!');
        refreshData(); // Reloads the product to show the new review
    } catch (err) {
        alert('Failed to submit review');
    }
  };

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Reviews ⭐</h3>
      
      {/* Reviews List */}
      <div className="space-y-3 mb-6 max-h-40 overflow-y-auto">
        {initialReviews && initialReviews.length > 0 ? (
            initialReviews.map((review, idx) => (
                <div key={idx} className="border-b pb-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-700">{review.user}</span>
                        <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                </div>
            ))
        ) : (
            <p className="text-sm text-gray-500 italic">No reviews yet. Be the first!</p>
        )}
      </div>

      {/* Add Review Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input 
            className="p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            placeholder="Write a review..." 
            value={comment} 
            onChange={e => setComment(e.target.value)}
            required 
        />
        <div className="flex justify-between items-center">
            <select 
                className="p-1 border rounded text-sm bg-white" 
                value={rating} 
                onChange={e => setRating(parseInt(e.target.value))}
            >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Bad</option>
            </select>
            <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition">
                Submit
            </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackSection;