module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define("transactions", {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    description: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    amount: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false
    },
    currency: {
      type: Sequelize.STRING(3),
      allowNull: false
    },
    exchange_rate: {
      type: Sequelize.DECIMAL(12, 6),
      allowNull: false
    },
    transaction_type: {
      type: Sequelize.ENUM('income', 'expense'),
      allowNull: false
    },
    transaction_date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Transaction;
};
