import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { JournalEntry, Emotion, TimeOfDay } from '../../types';
import { DEMO_JOURNAL_ENTRIES } from '../../constants';
import Button from '../shared/Button';
import Modal from '../shared/Modal';

interface TooltipData {
    x: number;
    y: number;
    entry: JournalEntry;
}

const LEAF_POSITIONS = [
  // Original 100
  {x:80, y:100}, {x:120, y:150}, {x:60, y:180}, {x:150, y:200}, {x:90, y:240}, 
  {x:180, y:280}, {x:40, y:60}, {x:100, y:30}, {x:200, y:250}, {x:220, y:180}, 
  {x:140, y:100}, {x:240, y:130}, {x:520, y:100}, {x:480, y:150}, {x:540, y:180}, 
  {x:450, y:200}, {x:510, y:240}, {x:420, y:280}, {x:560, y:60}, {x:500, y:30}, 
  {x:400, y:250}, {x:380, y:180}, {x:460, y:100}, {x:360, y:130}, {x:280, y:20}, 
  {x:320, y:20}, {x:260, y:60}, {x:340, y:60}, {x:290, y:90}, {x:310, y:90},
  {x:25, y:45}, {x:45, y:80}, {x:90, y:40}, {x:110, y:70}, {x:65, y:140},
  {x:35, y:190}, {x:55, y:210}, {x:115, y:110}, {x:130, y:130}, {x:160, y:175},
  {x:170, y:220}, {x:195, y:200}, {x:210, y:230}, {x:160, y:300}, {x:140, y:270},
  {x:115, y:330}, {x:135, y:345}, {x:230, y:100}, {x:250, y:115}, {x:265, y:90},
  {x:575, y:45}, {x:555, y:80}, {x:510, y:40}, {x:490, y:70}, {x:535, y:140},
  {x:565, y:190}, {x:545, y:210}, {x:485, y:110}, {x:470, y:130}, {x:440, y:175},
  {x:430, y:220}, {x:405, y:200}, {x:390, y:230}, {x:440, y:300}, {x:460, y:270},
  {x:485, y:330}, {x:465, y:345}, {x:370, y:100}, {x:350, y:115}, {x:335, y:90},
  {x:170, y:320}, {x:190, y:340}, {x:210, y:280}, {x:230, y:300}, {x:250, y:270},
  {x:430, y:320}, {x:410, y:340}, {x:390, y:280}, {x:370, y:300}, {x:350, y:270},
  {x:100, y:170}, {x:80, y:200}, {x:120, y:230}, {x:60, y:250}, {x:40, y:220},
  {x:500, y:170}, {x:520, y:200}, {x:480, y:230}, {x:540, y:250}, {x:560, y:220},
  {x:280, y:120}, {x:320, y:120}, {x:260, y:140}, {x:340, y:140}, {x:300, y:150},
  {x:275, y:170}, {x:325, y:170}, {x:290, y:190}, {x:310, y:190}, {x:300, y:210},
  
  // ADDED 150 NEW POSITIONS
  // Upper left canopy
  {x:20, y:25}, {x:40, y:35}, {x:60, y:20}, {x:85, y:15}, {x:110, y:20}, {x:130, y:40}, {x:150, y:60}, {x:125, y:80},
  {x:70, y:70}, {x:50, y:95}, {x:30, y:110}, {x:50, y:125}, {x:80, y:130}, {x:105, y:140}, {x:135, y:160},
  // Mid left branches
  {x:20, y:150}, {x:40, y:165}, {x:65, y:160}, {x:30, y:230}, {x:55, y:240}, {x:75, y:220}, {x:95, y:210}, {x:110, y:190},
  {x:130, y:215}, {x:155, y:225}, {x:175, y:245}, {x:190, y:260}, {x:165, y:260}, {x:145, y:240},
  // Lower left branches
  {x:100, y:260}, {x:120, y:280}, {x:140, y:300}, {x:125, y:315}, {x:105, y:300}, {x:85, y:320}, {x:150, y:320}, {x:170, y:335},
  {x:190, y:315}, {x:210, y:330}, {x:230, y:310}, {x:205, y:295},
  // Upper right canopy
  {x:580, y:25}, {x:560, y:35}, {x:540, y:20}, {x:515, y:15}, {x:490, y:20}, {x:470, y:40}, {x:450, y:60}, {x:475, y:80},
  {x:530, y:70}, {x:550, y:95}, {x:570, y:110}, {x:550, y:125}, {x:520, y:130}, {x:495, y:140}, {x:465, y:160},
  // Mid right branches
  {x:580, y:150}, {x:560, y:165}, {x:535, y:160}, {x:570, y:230}, {x:545, y:240}, {x:525, y:220}, {x:505, y:210}, {x:490, y:190},
  {x:470, y:215}, {x:445, y:225}, {x:425, y:245}, {x:410, y:260}, {x:435, y:260}, {x:455, y:240},
  // Lower right branches
  {x:500, y:260}, {x:480, y:280}, {x:460, y:300}, {x:475, y:315}, {x:495, y:300}, {x:515, y:320}, {x:450, y:320}, {x:430, y:335},
  {x:410, y:315}, {x:390, y:330}, {x:370, y:310}, {x:395, y:295},
  // Center top canopy
  {x:280, y:5}, {x:320, y:5}, {x:300, y:10}, {x:260, y:30}, {x:340, y:30}, {x:270, y:45}, {x:330, y:45}, {x:290, y:55},
  {x:310, y:55}, {x:300, y:70}, {x:280, y:80}, {x:320, y:80}, {x:260, y:100}, {x:340, y:100}, {x:280, y:110},
  {x:320, y:110}, {x:300, y:130}, {x:270, y:125}, {x:330, y:125},
  // Infill left
  {x:180, y:160}, {x:200, y:140}, {x:220, y:160}, {x:240, y:180}, {x:215, y:190}, {x:190, y:170}, {x:160, y:145}, {x:140, y:180},
  {x:120, y:200}, {x:100, y:220}, {x:80, y:260}, {x:60, y:280}, {x:40, y:300}, {x:70, y:300}, {x:90, y:280}, {x:110, y:310},
  {x:130, y:250}, {x:150, y:280}, {x:170, y:200}, {x:230, y:210}, {x:250, y:230}, {x:260, y:250}, {x:240, y:260},
  // Infill right
  {x:420, y:160}, {x:400, y:140}, {x:380, y:160}, {x:360, y:180}, {x:385, y:190}, {x:410, y:170}, {x:440, y:145}, {x:460, y:180},
  {x:480, y:200}, {x:500, y:220}, {x:520, y:260}, {x:540, y:280}, {x:560, y:300}, {x:530, y:300}, {x:510, y:280}, {x:490, y:310},
  {x:470, y:250}, {x:450, y:280}, {x:430, y:200}, {x:370, y:210}, {x:350, y:230}, {x:340, y:250}, {x:360, y:260},
  // Infill center
  {x:280, y:160}, {x:320, y:160}, {x:300, y:180}, {x:285, y:200}, {x:315, y:200}, {x:300, y:220}, {x:275, y:230}, {x:325, y:230},
  {x:290, y:250}, {x:310, y:250}, {x:300, y:270}, {x:280, y:280}, {x:320, y:280}, {x:260, y:200}, {x:340, y:200},
  // Add 30 more leaves
  {x: 15, y: 135}, {x: 45, y: 145}, {x: 70, y: 115}, // left mid
  {x: 100, y: 195}, {x: 125, y: 265}, {x: 155, y: 195}, // left mid
  {x: 200, y: 325}, {x: 180, y: 295}, {x: 160, y: 335}, // left low
  {x: 270, y: 195}, {x: 300, y: 245}, {x: 330, y: 195}, // center
  {x: 285, y: 145}, {x: 315, y: 145}, {x: 300, y: 105}, // center high
  {x: 585, y: 135}, {x: 555, y: 145}, {x: 530, y: 115}, // right mid
  {x: 500, y: 195}, {x: 475, y: 265}, {x: 445, y: 195}, // right mid
  {x: 400, y: 325}, {x: 420, y: 295}, {x: 440, y: 335}, // right low
  {x: 25, y: 90}, {x: 575, y: 90}, {x: 250, y: 150}, {x: 350, y: 150}, // infill
  {x: 220, y: 250}, {x: 380, y: 250}, // infill
  // Add 30 more leaves (July 28)
  {x: 18, y: 75}, {x: 35, y: 100}, {x: 65, y: 90}, // far left
  {x: 582, y: 75}, {x: 565, y: 100}, {x: 535, y: 90}, // far right
  {x: 275, y: 70}, {x: 325, y: 70}, {x: 300, y: 40}, // center top
  {x: 130, y: 85}, {x: 155, y: 115}, {x: 175, y: 90}, // left inner
  {x: 470, y: 85}, {x: 445, y: 115}, {x: 425, y: 90}, // right inner
  {x: 240, y: 220}, {x: 265, y: 235}, {x: 250, y: 200}, // left-center lower
  {x: 360, y: 220}, {x: 335, y: 235}, {x: 350, y: 200}, // right-center lower
  {x: 70, y: 270}, {x: 95, y: 325}, {x: 50, y: 310}, // far left lower
  {x: 530, y: 270}, {x: 505, y: 325}, {x: 550, y: 310}, // far right lower
  {x: 290, y: 300}, {x: 310, y: 300}, {x: 300, y: 320}, // center bottom
];


const emotionGradientMap: Record<Emotion, string> = {
    joy: 'leafGrad3',
    sadness: 'leafGrad5',
    anger: 'leafGrad4',
    calm: 'leafGrad1',
    anxiety: 'leafGrad2'
};

const EmotionTree: React.FC = () => {
  const { journalEntries, addJournalEntry, t } = useContext(AppContext);
  const [isLogging, setIsLogging] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [logData, setLogData] = useState<Omit<JournalEntry, 'id' | 'date'>>({
    timeOfDay: 'morning',
    emotion: 'joy',
    intensity: 3,
    note: ''
  });

  const width = 600;
  const height = 600;

  const handleLogEmotion = () => {
      const today = new Date().toISOString().split('T')[0];
      addJournalEntry({ ...logData, date: today });
      setIsLogging(false);
      setLogData({timeOfDay: 'morning', emotion: 'joy', intensity: 3, note: ''});
  };

  const activeEntries = isPreviewing ? DEMO_JOURNAL_ENTRIES : journalEntries;

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="text-xl font-bold text-shade-1">{t('tree.title')}</h3>
        <div className="flex space-x-2">
            <Button onClick={() => setIsPreviewing(!isPreviewing)} variant="secondary">
                {isPreviewing ? t('tree.my_tree') : t('tree.preview_full')}
            </Button>
            <Button onClick={() => setIsLogging(true)}>{t('tree.log_emotion')}</Button>
        </div>
      </div>
      <div className="flex-grow relative min-h-0">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
            <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#C0B3E0', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#604e82', stopOpacity: 1 }} />
            </linearGradient>

            {/* Richer, more saturated gradients */}
            <radialGradient id="leafGrad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" stopColor="#98FB98" /><stop offset="100%" stopColor="#3CB371" /></radialGradient>
            <radialGradient id="leafGrad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" stopColor="#DA70D6" /><stop offset="100%" stopColor="#9932CC" /></radialGradient>
            <radialGradient id="leafGrad3" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" stopColor="#FFD700" /><stop offset="100%" stopColor="#FFB347" /></radialGradient>
            <radialGradient id="leafGrad4" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" stopColor="#FF6347" /><stop offset="100%" stopColor="#DC143C" /></radialGradient>
            <radialGradient id="leafGrad5" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" stopColor="#87CEEB" /><stop offset="100%" stopColor="#4169E1" /></radialGradient>
            
            <path id="leafShape" d="M0,0 C5,-5 15,-5 20,0 C15,5 5,5 0,0 Z" />
            <filter id="treeShadow" x="-0.1" y="-0.1" width="1.2" height="1.2">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
                <feOffset in="blur" dx="2" dy="2" result="offsetBlur"/>
                <feMerge>
                    <feMergeNode in="offsetBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        
        <rect width="600" height="600" fill="#f9f5eb" />

        <g id="ground">
            <path d="M0,580 Q150,560 300,580 T600,580 L600,600 L0,600 Z" fill="#D7E0CC"/>
            <path d="M0,580 Q150,570 300,590 T600,590 Z" fill="#C8D4BC" opacity="0.7"/>
        </g>
        
        <g id="trunk-and-branches" filter="url(#treeShadow)">
            <path d="M295,580 C280,450 280,300 300,50 C320,300 320,450 305,580 Z" fill="url(#trunkGradient)"/>
            <path d="M300,480 C280,400 230,350 180,300 L150,250 C130,220 100,180 80,150" stroke="#75649c" strokeWidth="15" fill="none" strokeLinecap="round"/>
            <path d="M290,400 C240,300 180,250 100,200 L70,150 C50,120 30,80 20,50" stroke="#75649c" strokeWidth="12" fill="none" strokeLinecap="round"/>
            <path d="M300,300 C280,200 250,150 200,100 L170,70 C150,50 130,30 100,20" stroke="#75649c" strokeWidth="10" fill="none" strokeLinecap="round"/>
            <path d="M300,480 C320,400 370,350 420,300 L450,250 C470,220 500,180 520,150" stroke="#75649c" strokeWidth="15" fill="none" strokeLinecap="round"/>
            <path d="M310,400 C360,300 420,250 500,200 L530,150 C550,120 570,80 580,50" stroke="#75649c" strokeWidth="12" fill="none" strokeLinecap="round"/>
            <path d="M300,300 C320,200 350,150 400,100 L430,70 C450,50 470,30 500,20" stroke="#75649c" strokeWidth="10" fill="none" strokeLinecap="round"/>
            <path d="M300,250 C300,180 300,100 300,50" stroke="#75649c" strokeWidth="8" fill="none" strokeLinecap="round"/>

            {/* <!-- Secondary Branches --> */}
            <path d="M150,250 C160,220 180,200 190,180" stroke="#8a7aad" strokeWidth="8" fill="none" strokeLinecap="round"/>
            <path d="M70,150 C80,130 95,110 110,100" stroke="#8a7aad" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d="M180,300 C160,320 130,330 110,340" stroke="#8a7aad" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <path d="M80,150 C60,160 40,180 30,200" stroke="#8a7aad" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M200,100 C220,90 240,85 260,80" stroke="#8a7aad" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M450,250 C440,220 420,200 410,180" stroke="#8a7aad" strokeWidth="8" fill="none" strokeLinecap="round"/>
            <path d="M530,150 C520,130 500,110 480,100" stroke="#8a7aad" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d="M420,300 C440,320 470,330 490,340" stroke="#8a7aad" strokeWidth="9" fill="none" strokeLinecap="round"/>
            <path d="M520,150 C540,160 560,180 570,200" stroke="#8a7aad" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M400,100 C380,90 360,85 340,80" stroke="#8a7aad" strokeWidth="7" fill="none" strokeLinecap="round"/>
        </g>
        
        <g id="leaves-dynamic">
            {activeEntries.slice(0, LEAF_POSITIONS.length).map((entry, i) => {
                const pos = LEAF_POSITIONS[i % LEAF_POSITIONS.length];
                const rotation = (entry.id.charCodeAt(entry.id.length-1) % 40) - 20; // Consistent random rotation
                const scale = 1.0 + entry.intensity * 0.1;

                return (
                    <g 
                        key={entry.id}
                        transform={`translate(${pos.x}, ${pos.y})`}
                        onMouseEnter={() => setTooltip({ x: pos.x, y: pos.y, entry })}
                        onMouseLeave={() => setTooltip(null)}
                        className="cursor-pointer"
                        style={{ transition: 'opacity 300ms ease-in-out' }}
                    >
                        <use
                            href="#leafShape"
                            transform={`scale(${scale}) rotate(${rotation})`}
                            fill={`url(#${emotionGradientMap[entry.emotion]})`}
                            stroke="rgba(0,0,0,0.1)"
                            strokeWidth={0.5}
                        />
                    </g>
                );
            })}
        </g>
      </svg>
      </div>
      {tooltip && (
          <div 
            className="absolute bg-shade-1 text-white p-2 rounded-lg text-sm shadow-lg pointer-events-none"
            style={{ 
                left: `calc(${tooltip.x / width * 100}%)`, 
                top: `calc(${tooltip.y / height * 100}%)`, 
                transform: 'translateX(-50%) translateY(-110%)' 
            }}
          >
            <p><strong>{t('emotions.'+tooltip.entry.emotion)}</strong> ({t(`tree.${tooltip.entry.timeOfDay}`)})</p>
            <p>{t('tree.tooltip_intensity')}: {tooltip.entry.intensity}/5</p>
            {tooltip.entry.note && <p className="mt-1 italic">"{tooltip.entry.note}"</p>}
          </div>
      )}
      {isLogging && (
          <Modal isOpen={isLogging} onClose={() => setIsLogging(false)} title={t('tree.log_emotion')}>
              <div className="space-y-4 text-white">
                  <div>
                      <label className="font-semibold">{t('tree.time_of_day')}</label>
                      <div className="flex space-x-2 mt-1">
                          {(['morning', 'noon', 'evening'] as TimeOfDay[]).map(tod => (
                              <Button key={tod} variant={logData.timeOfDay === tod ? 'primary' : 'secondary'} onClick={() => setLogData({...logData, timeOfDay: tod})}>{t(`tree.${tod}`)}</Button>
                          ))}
                      </div>
                  </div>
                   <div>
                      <label className="font-semibold">{t('tree.emotion')}</label>
                      <div className="flex space-x-2 mt-1 flex-wrap gap-2">
                          {(Object.keys(emotionGradientMap) as Emotion[]).map(emotion => (
                              <Button key={emotion} variant={logData.emotion === emotion ? 'primary' : 'secondary'} onClick={() => setLogData({...logData, emotion})}>{t(`emotions.${emotion}`)}</Button>
                          ))}
                      </div>
                  </div>
                  <div>
                      <label className="font-semibold">{t('tree.intensity')} ({logData.intensity})</label>
                      <input type="range" min="1" max="5" value={logData.intensity} onChange={e => setLogData({...logData, intensity: parseInt(e.target.value)})} className="w-full h-2 bg-shade-3 rounded-lg appearance-none cursor-pointer" />
                  </div>
                   <div>
                      <label className="font-semibold">{t('tree.note')}</label>
                      <textarea value={logData.note} onChange={e => setLogData({...logData, note: e.target.value})} className="w-full h-24 p-2 border border-shade-2 rounded-lg bg-white/20 focus:ring-2 focus:ring-shade-2 focus:outline-none text-white placeholder-shade-4/70" placeholder={t('tree.note_placeholder')} />
                  </div>
                  <Button onClick={handleLogEmotion} className="w-full">{t('tree.save_log')}</Button>
              </div>
          </Modal>
      )}
    </div>
  );
};

export default EmotionTree;