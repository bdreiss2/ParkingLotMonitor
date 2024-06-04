import React, { useState } from 'react';

interface DistanceButtonProps {
    onDistanceMeasured: (distance: number) => void;
    onClick: (clickCount: number) => void;
}

const DistanceButton: React.FC<DistanceButtonProps> = ({ onDistanceMeasured, onClick }) => {
    const [clickCount, setClickCount] = useState(0);
    const [firstClick, setFirstClick] = useState<{ x: number, y: number } | null>(null);
    const [ignoreClick, setIgnoreClick] = useState(true);

    const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    const handleClick = (event: MouseEvent) => {
        const { clientX, clientY } = event;

        if(ignoreClick){
            setIgnoreClick(false);
            return;
        }
        if (clickCount === 3){
            const distance = calculateDistance(firstClick!.x, firstClick!.y, clientX, clientY);
            setFirstClick({ x: clientX, y: clientY });
            onDistanceMeasured(distance);
            setClickCount(2); 
        }
        if (clickCount === 2){
            const distance = calculateDistance(firstClick!.x, firstClick!.y, clientX, clientY);
            setFirstClick({ x: clientX, y: clientY });
            onDistanceMeasured(distance);
            setClickCount(3); 
        }
         if (clickCount === 0) {
            setFirstClick({ x: clientX, y: clientY });
            setClickCount(1);
            onClick(2);
        } else if (clickCount === 1) {
            const distance = calculateDistance(firstClick!.x, firstClick!.y, clientX, clientY);
            setFirstClick({ x: clientX, y: clientY });
            onDistanceMeasured(distance); 
            setClickCount(2);
        }

    };

    const handleButtonClick = () => {
        setIgnoreClick(true);
        onClick(1);
    };

    
    React.useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    
    }, [clickCount, ignoreClick]);

    return (
        <button onClick={handleButtonClick}>Start Measuring</button>
    );
};

export default DistanceButton;
