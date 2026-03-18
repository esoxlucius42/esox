import React from 'react';
import styled from 'styled-components';

const CATEGORY_LABELS = {
  tasteAsIs: 'Taste as is',
  tasteAfterCook: 'Taste after cooking',
  softness: 'Softness',
  cooked: 'Cooked',
  sauce: 'Sauce',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
}

// ── Styled components ──────────────────────────────────────────────────────────

const Card = styled.div`
  background: #07111f;
  border: 1px solid #1a3a6a;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.15s;

  &:hover {
    border-color: #4d9fec;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: contain;
  background: #050d1a;
  border-bottom: 1px solid #1a3a6a;
`;

const CardBody = styled.div`
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const CardTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #c8dff5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardDate = styled.span`
  font-size: 11px;
  color: #4a6a8a;
`;

const ScoreBadge = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #4d9fec;
`;

const BuyAgainBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid ${({ $yes }) => ($yes ? '#2ecc71' : '#4a6a8a')};
  color: ${({ $yes }) => ($yes ? '#2ecc71' : '#4a6a8a')};
`;

const CategoryScores = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CategoryName = styled.span`
  font-size: 11px;
  color: #5a7a9a;
`;

const ScoreDots = styled.div`
  display: flex;
  gap: 3px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#4d9fec' : '#1a3a6a')};
`;

const CardFooter = styled.div`
  display: flex;
  gap: 6px;
  padding: 10px 14px;
  border-top: 1px solid #1a3a6a;
`;

const ActionButton = styled.button`
  flex: 1;
  height: 26px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  border: 1px solid ${({ $confirming }) => ($confirming ? '#e74c3c' : '#1a3a6a')};
  background: ${({ $confirming }) => ($confirming ? 'rgba(231,76,60,0.15)' : 'transparent')};
  color: ${({ $confirming, $danger }) => ($confirming ? '#e74c3c' : $danger ? '#6a90b8' : '#6a90b8')};

  &:hover {
    border-color: ${({ $danger }) => ($danger ? '#e74c3c' : '#4d9fec')};
    color: ${({ $danger }) => ($danger ? '#e74c3c' : '#c8dff5')};
  }
`;

// ── Component ──────────────────────────────────────────────────────────────────

export default function ReviewCard({ review, onEdit, onDelete }) {
  const [confirming, setConfirming] = React.useState(false);

  const imageSrc = review.imageData
    ? `data:image/jpeg;base64,${review.imageData}`
    : '/bazul.blank.png';

  function handleDeleteClick() {
    if (confirming) {
      onDelete(review.id);
    } else {
      setConfirming(true);
    }
  }

  return (
    <Card onMouseLeave={() => setConfirming(false)}>
      <CardImage src={imageSrc} alt={review.title} />
      <CardBody>
        <CardTitle title={review.title}>{review.title || 'Untitled'}</CardTitle>
        <CardMeta>
          <CardDate>{formatDate(review.reviewDate)}</CardDate>
          <ScoreBadge>{review.totalScore ?? 0} / 25</ScoreBadge>
          <BuyAgainBadge $yes={review.wouldBuyAgain}>
            {review.wouldBuyAgain ? '✓ Buy again' : '✗ No buy'}
          </BuyAgainBadge>
        </CardMeta>
        <CategoryScores>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <CategoryRow key={key}>
              <CategoryName>{label}</CategoryName>
              <ScoreDots>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Dot key={n} $active={n <= (review[key] ?? 0)} />
                ))}
              </ScoreDots>
            </CategoryRow>
          ))}
        </CategoryScores>
      </CardBody>
      <CardFooter>
        <ActionButton onClick={() => onEdit(review)}>Edit</ActionButton>
        <ActionButton $danger $confirming={confirming} onClick={handleDeleteClick}>
          {confirming ? 'Sure?' : 'Delete'}
        </ActionButton>
      </CardFooter>
    </Card>
  );
}
