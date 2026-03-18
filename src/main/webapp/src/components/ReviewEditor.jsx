import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const CATEGORIES = [
  { key: 'tasteAsIs', label: 'Taste as is' },
  { key: 'tasteAfterCook', label: 'Taste after cooking' },
  { key: 'softness', label: 'Softness' },
  { key: 'cooked', label: 'Cooked' },
  { key: 'sauce', label: 'Sauce' },
];

const SCORES = [1, 2, 3, 4, 5];

function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

function buildInitialScores(review) {
  const scores = {};
  CATEGORIES.forEach(({ key }) => {
    scores[key] = review?.[key] ?? 0;
  });
  return scores;
}

// ── Styled components ──────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 8, 18, 0.82);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dialog = styled.div`
  background: #07111f;
  border: 1px solid #1a3a6a;
  border-radius: 8px;
  width: 900px;
  max-width: 96vw;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// Left column – image
const ImagePanel = styled.div`
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 24px;
  border-right: 1px solid #1a3a6a;
  gap: 14px;
`;

const ProductImage = styled.img`
  width: 100%;
  max-height: 340px;
  object-fit: contain;
  border-radius: 6px;
  cursor: pointer;
  border: 2px dashed #1a3a6a;
  transition: border-color 0.15s;

  &:hover {
    border-color: #4d9fec;
  }
`;

const ImageHint = styled.span`
  font-size: 11px;
  color: #4a6a8a;
  text-align: center;
`;

// Right column – form
const FormPanel = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 28px 28px 12px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const TitleInput = styled.input`
  width: 100%;
  background: #0d1e33;
  border: 1px solid #1a3a6a;
  border-radius: 4px;
  color: #c8dff5;
  font-size: 16px;
  font-weight: 600;
  padding: 9px 12px;
  outline: none;
  box-sizing: border-box;

  &::placeholder { color: #3a5a7a; }
  &:focus { border-color: #4d9fec; }
`;

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CategoryLabel = styled.span`
  width: 160px;
  flex-shrink: 0;
  font-size: 13px;
  color: #8ab0d0;
`;

const ScoreChips = styled.div`
  display: flex;
  gap: 6px;
`;

const ScoreChip = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 4px;
  border: 1px solid ${({ $active }) => ($active ? '#4d9fec' : '#1a3a6a')};
  background: ${({ $active }) => ($active ? '#1a3a6a' : '#0d1e33')};
  color: ${({ $active }) => ($active ? '#c8dff5' : '#5a7a9a')};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.1s, border-color 0.1s, color 0.1s;

  &:hover {
    border-color: #4d9fec;
    color: #c8dff5;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #1a3a6a;
  margin: 0;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const BuyAgainRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BuyAgainLabel = styled.span`
  font-size: 13px;
  color: #8ab0d0;
`;

const Toggle = styled.button`
  padding: 5px 16px;
  border-radius: 4px;
  border: 1px solid ${({ $active }) => ($active ? '#2ecc71' : '#1a3a6a')};
  background: ${({ $active }) => ($active ? 'rgba(46,204,113,0.15)' : '#0d1e33')};
  color: ${({ $active }) => ($active ? '#2ecc71' : '#5a7a9a')};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover { border-color: #2ecc71; color: #2ecc71; }
`;

const TotalScore = styled.div`
  font-size: 13px;
  color: #6a90b8;

  span {
    font-size: 20px;
    font-weight: 700;
    color: #4d9fec;
    margin-left: 6px;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 28px;
  border-top: 1px solid #1a3a6a;
  flex-shrink: 0;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DateDisplay = styled.span`
  font-size: 12px;
  color: #4a6a8a;
`;

const FooterButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const CancelButton = styled.button`
  background: transparent;
  color: #6a90b8;
  border: 1px solid #1a3a6a;
  border-radius: 4px;
  padding: 0 20px;
  height: 32px;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;

  &:hover { border-color: #4d9fec; color: #c8dff5; }
`;

const SaveButton = styled.button`
  background: #1a3a6a;
  color: #c8dff5;
  border: 1px solid #4d9fec;
  border-radius: 4px;
  padding: 0 24px;
  height: 32px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #2a5a9a; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const ErrorBanner = styled.div`
  background: rgba(231, 76, 60, 0.12);
  border: 1px solid #c0392b;
  border-radius: 4px;
  color: #e74c3c;
  font-size: 12px;
  padding: 8px 12px;
  margin: 8px 28px 0 28px;
  word-break: break-word;
`;

export default function ReviewEditor({ review, onSave, onCancel, saveError }) {
  const [title, setTitle] = useState(review?.title ?? '');
  const [scores, setScores] = useState(buildInitialScores(review));
  const [wouldBuyAgain, setWouldBuyAgain] = useState(review?.wouldBuyAgain ?? false);
  const [imagePreview, setImagePreview] = useState(
    review?.imageData ? `data:image/jpeg;base64,${review.imageData}` : null
  );
  const [imageData, setImageData] = useState(review?.imageData ?? null);
  const fileInputRef = useRef(null);

  const today = formatDate(new Date());

  const totalScore = CATEGORIES.reduce((sum, { key }) => sum + (scores[key] || 0), 0);

  function setScore(key, value) {
    setScores((prev) => ({ ...prev, [key]: prev[key] === value ? 0 : value }));
  }

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  function compressToDataUrl(imgEl) {
    const MAX_B64 = 9500;
    const attempts = [
      { maxDim: 400, quality: 0.82 },
      { maxDim: 400, quality: 0.65 },
      { maxDim: 300, quality: 0.65 },
      { maxDim: 300, quality: 0.50 },
      { maxDim: 200, quality: 0.60 },
      { maxDim: 200, quality: 0.40 },
      { maxDim: 150, quality: 0.50 },
      { maxDim: 120, quality: 0.50 },
    ];
    for (const { maxDim, quality } of attempts) {
      const scale = Math.min(1, maxDim / Math.max(imgEl.width, imgEl.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(imgEl.width * scale);
      canvas.height = Math.round(imgEl.height * scale);
      canvas.getContext('2d').drawImage(imgEl, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      if (dataUrl.replace(/^data:[^;]+;base64,/, '').length <= MAX_B64) return dataUrl;
    }
    // Last resort: 120px @ 0.5
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 120 / Math.max(imgEl.width, imgEl.height));
    canvas.width = Math.round(imgEl.width * scale);
    canvas.height = Math.round(imgEl.height * scale);
    canvas.getContext('2d').drawImage(imgEl, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.5);
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const dataUrl = compressToDataUrl(img);
        setImagePreview(dataUrl);
        setImageData(dataUrl.replace(/^data:[^;]+;base64,/, ''));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    const payload = {
      title,
      imageData,
      wouldBuyAgain,
      ...scores,
    };
    onSave(payload);
  }

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <Dialog>
        <Body>
          {/* Left: image */}
          <ImagePanel>
            <ProductImage
              src={imagePreview ?? '/bazul.blank.png'}
              alt="Product"
              onClick={handleImageClick}
            />
            <ImageHint>Click image to upload a photo</ImageHint>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </ImagePanel>

          {/* Right: form */}
          <FormPanel>
            <TitleInput
              type="text"
              placeholder="Product name…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {CATEGORIES.map(({ key, label }) => (
              <CategoryRow key={key}>
                <CategoryLabel>{label}</CategoryLabel>
                <ScoreChips>
                  {SCORES.map((n) => (
                    <ScoreChip
                      key={n}
                      $active={scores[key] === n}
                      onClick={() => setScore(key, n)}
                    >
                      {n}
                    </ScoreChip>
                  ))}
                </ScoreChips>
              </CategoryRow>
            ))}

            <Divider />

            <BottomRow>
              <BuyAgainRow>
                <BuyAgainLabel>Would buy again</BuyAgainLabel>
                <Toggle $active={wouldBuyAgain} onClick={() => setWouldBuyAgain((v) => !v)}>
                  {wouldBuyAgain ? 'Yes' : 'No'}
                </Toggle>
              </BuyAgainRow>
              <TotalScore>
                Total score <span>{totalScore}</span> / 25
              </TotalScore>
            </BottomRow>
          </FormPanel>
        </Body>

        <Footer>
          {saveError && <ErrorBanner>{saveError}</ErrorBanner>}
          <FooterRow>
            <DateDisplay>{today}</DateDisplay>
            <FooterButtons>
              <CancelButton onClick={onCancel}>Cancel</CancelButton>
              <SaveButton onClick={handleSave} disabled={!title.trim()}>
                Save
              </SaveButton>
            </FooterButtons>
          </FooterRow>
        </Footer>
      </Dialog>
    </Overlay>
  );
}
