import React from 'react';

const BudgetSummary = ({ total, remaining, budget }) => {
  return (
    <div className="tracker-summary">
      <p><strong>Total Spent:</strong> ₹{total}</p>
      <p>
        <strong>{remaining >= 0 ? 'Remaining Balance:' : 'Overspent:'}</strong>{' '}
        ₹{Math.abs(budget - total)}
      </p>
    </div>
  );
};

export default BudgetSummary;
