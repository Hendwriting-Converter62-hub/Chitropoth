import React, { useState } from 'react';
import { Review } from '../types.ts';

interface ReviewSectionProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews, onAddReview }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onAddReview({ user: 'Guest User', rating, comment });
    setComment('');
    setRating(5);
  };

  return (
    <div className="mt-12 md:mt-16 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-100">
      <h3 className="text-xl md:text-2xl font-serif mb-8">Customer Reflections</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12">
        {/* Review List */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {reviews.length === 0 ? (
            <p className="text-stone-500 italic text-sm">No reviews yet. Be the first to share your thoughts.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="border-b border-stone-50 pb-6 transition-colors hover:bg-stone-50/30 p-2 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex text-amber-500 text-[10px]">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fa-solid fa-star ${i < rev.rating ? '' : 'text-stone-200'}`}></i>
                    ))}
                  </div>
                  <span className="font-bold text-xs text-stone-800">{rev.user}</span>
                  <span className="text-[10px] text-stone-400 font-medium">— {rev.date}</span>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Add Review Form */}
        <div className="bg-stone-50 p-6 rounded-2xl h-fit border border-stone-100 shadow-inner">
          <h4 className="text-base md:text-lg font-serif mb-4">Add Your Review</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-2 ml-1">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-base transition-transform hover:scale-125 ${star <= rating ? 'text-amber-500' : 'text-stone-300'}`}
                  >
                    <i className="fa-solid fa-star"></i>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-2 ml-1">Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                rows={4}
                placeholder="Share your experience..."
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-stone-800 transition-all shadow-md active:scale-[0.98]"
            >
              Post Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;