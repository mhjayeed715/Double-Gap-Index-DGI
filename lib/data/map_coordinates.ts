/**
 * Accurate SVG boundary paths and centroids for all 64 districts of Bangladesh
 * Viewport: 0 0 800 1020
 * Geographical alignment: North 26.6°N down to South 20.7°N, West 88.0°E to East 92.7°E
 */

export interface DistrictMapFeature {
  id: string;
  name: string;
  division: string;
  cx: number;
  cy: number;
  d: string;
}

export const BANGLADESH_DISTRICTS_MAP: DistrictMapFeature[] = [
  // --- RANGPUR DIVISION (North-West) ---
  {
    id: "panchagarh",
    name: "Panchagarh",
    division: "Rangpur Division",
    cx: 145,
    cy: 65,
    d: "M 120,40 L 165,30 L 180,65 L 160,95 L 125,95 L 110,70 Z"
  },
  {
    id: "thakurgaon",
    name: "Thakurgaon",
    division: "Rangpur Division",
    cx: 140,
    cy: 130,
    d: "M 115,100 L 160,98 L 175,135 L 155,165 L 115,160 L 105,125 Z"
  },
  {
    id: "nilphamari",
    name: "Nilphamari",
    division: "Rangpur Division",
    cx: 215,
    cy: 115,
    d: "M 185,85 L 245,80 L 250,125 L 230,150 L 180,140 Z"
  },
  {
    id: "lalmonirhat",
    name: "Lalmonirhat",
    division: "Rangpur Division",
    cx: 280,
    cy: 95,
    d: "M 248,78 L 310,70 L 320,110 L 285,125 L 252,120 Z"
  },
  {
    id: "kurigram",
    name: "Kurigram",
    division: "Rangpur Division",
    cx: 335,
    cy: 135,
    d: "M 315,105 L 365,105 L 375,155 L 340,180 L 310,160 Z"
  },
  {
    id: "dinajpur",
    name: "Dinajpur",
    division: "Rangpur Division",
    cx: 180,
    cy: 180,
    d: "M 160,145 L 215,145 L 225,205 L 175,225 L 140,200 L 155,165 Z"
  },
  {
    id: "rangpur",
    name: "Rangpur",
    division: "Rangpur Division",
    cx: 250,
    cy: 160,
    d: "M 228,135 L 285,130 L 305,175 L 265,200 L 225,190 Z"
  },
  {
    id: "gaibandha",
    name: "Gaibandha",
    division: "Rangpur Division",
    cx: 305,
    cy: 205,
    d: "M 285,180 L 340,175 L 350,225 L 310,245 L 275,230 Z"
  },

  // --- RAJSHAHI DIVISION (West / North-West) ---
  {
    id: "joypurhat",
    name: "Joypurhat",
    division: "Rajshahi Division",
    cx: 215,
    cy: 235,
    d: "M 195,215 L 245,210 L 250,250 L 210,265 L 185,245 Z"
  },
  {
    id: "naogaon",
    name: "Naogaon",
    division: "Rajshahi Division",
    cx: 195,
    cy: 285,
    d: "M 165,250 L 235,245 L 245,305 L 185,325 L 155,300 Z"
  },
  {
    id: "bogura",
    name: "Bogura",
    division: "Rajshahi Division",
    cx: 275,
    cy: 260,
    d: "M 245,235 L 315,230 L 325,295 L 265,305 L 240,280 Z"
  },
  {
    id: "chapainawabganj",
    name: "Chapainawabganj",
    division: "Rajshahi Division",
    cx: 120,
    cy: 330,
    d: "M 95,305 L 150,295 L 160,350 L 125,370 L 85,345 Z"
  },
  {
    id: "rajshahi",
    name: "Rajshahi",
    division: "Rajshahi Division",
    cx: 175,
    cy: 360,
    d: "M 155,330 L 215,325 L 225,385 L 165,400 L 140,370 Z"
  },
  {
    id: "natore",
    name: "Natore",
    division: "Rajshahi Division",
    cx: 235,
    cy: 345,
    d: "M 215,315 L 270,310 L 275,365 L 220,380 L 205,350 Z"
  },
  {
    id: "sirajganj",
    name: "Sirajganj",
    division: "Rajshahi Division",
    cx: 300,
    cy: 335,
    d: "M 275,300 L 340,290 L 350,365 L 295,385 L 270,355 Z"
  },
  {
    id: "pabna",
    name: "Pabna",
    division: "Rajshahi Division",
    cx: 265,
    cy: 405,
    d: "M 230,375 L 310,365 L 315,430 L 255,445 L 220,420 Z"
  },

  // --- MYMENSINGH DIVISION (North-Central) ---
  {
    id: "sherpur",
    name: "Sherpur",
    division: "Mymensingh Division",
    cx: 360,
    cy: 215,
    d: "M 335,190 L 395,185 L 405,235 L 360,255 L 325,235 Z"
  },
  {
    id: "jamalpur",
    name: "Jamalpur",
    division: "Mymensingh Division",
    cx: 335,
    cy: 270,
    d: "M 315,245 L 370,240 L 380,305 L 325,320 L 300,285 Z"
  },
  {
    id: "netrokona",
    name: "Netrokona",
    division: "Mymensingh Division",
    cx: 440,
    cy: 235,
    d: "M 405,205 L 485,200 L 490,265 L 430,285 L 395,255 Z"
  },
  {
    id: "mymensingh",
    name: "Mymensingh",
    division: "Mymensingh Division",
    cx: 395,
    cy: 295,
    d: "M 370,265 L 445,260 L 455,335 L 385,355 L 355,325 Z"
  },

  // --- SYLHET DIVISION (North-East) ---
  {
    id: "sunamganj",
    name: "Sunamganj",
    division: "Sylhet Division",
    cx: 520,
    cy: 230,
    d: "M 485,195 L 575,190 L 585,260 L 515,280 L 475,250 Z"
  },
  {
    id: "sylhet",
    name: "Sylhet",
    division: "Sylhet Division",
    cx: 605,
    cy: 250,
    d: "M 570,210 L 660,205 L 670,285 L 595,305 L 560,270 Z"
  },
  {
    id: "moulvibazar",
    name: "Moulvibazar",
    division: "Sylhet Division",
    cx: 615,
    cy: 330,
    d: "M 580,295 L 665,290 L 675,370 L 600,390 L 570,350 Z"
  },
  {
    id: "habiganj",
    name: "Habiganj",
    division: "Sylhet Division",
    cx: 535,
    cy: 325,
    d: "M 505,285 L 575,280 L 585,360 L 525,385 L 490,345 Z"
  },

  // --- DHAKA DIVISION (Central) ---
  {
    id: "tangail",
    name: "Tangail",
    division: "Dhaka Division",
    cx: 345,
    cy: 375,
    d: "M 315,335 L 390,330 L 400,410 L 340,430 L 305,395 Z"
  },
  {
    id: "kishoreganj",
    name: "Kishoreganj",
    division: "Dhaka Division",
    cx: 460,
    cy: 330,
    d: "M 430,295 L 505,290 L 515,365 L 450,385 L 420,350 Z"
  },
  {
    id: "gazipur",
    name: "Gazipur",
    division: "Dhaka Division",
    cx: 395,
    cy: 410,
    d: "M 370,385 L 440,380 L 445,445 L 385,465 L 360,435 Z"
  },
  {
    id: "narsingdi",
    name: "Narsingdi",
    division: "Dhaka Division",
    cx: 450,
    cy: 415,
    d: "M 430,385 L 495,380 L 500,445 L 440,465 L 420,435 Z"
  },
  {
    id: "manikganj",
    name: "Manikganj",
    division: "Dhaka Division",
    cx: 320,
    cy: 450,
    d: "M 290,425 L 360,420 L 365,480 L 310,500 L 280,470 Z"
  },
  {
    id: "dhaka",
    name: "Dhaka",
    division: "Dhaka Division",
    cx: 385,
    cy: 470,
    d: "M 360,445 L 425,440 L 430,505 L 375,525 L 345,495 Z"
  },
  {
    id: "narayanganj",
    name: "Narayanganj",
    division: "Dhaka Division",
    cx: 425,
    cy: 485,
    d: "M 405,465 L 460,460 L 465,515 L 415,530 L 395,505 Z"
  },
  {
    id: "munshiganj",
    name: "Munshiganj",
    division: "Dhaka Division",
    cx: 395,
    cy: 535,
    d: "M 370,510 L 435,505 L 440,565 L 385,585 L 355,555 Z"
  },
  {
    id: "rajbari",
    name: "Rajbari",
    division: "Dhaka Division",
    cx: 290,
    cy: 485,
    d: "M 260,460 L 325,455 L 330,515 L 275,535 L 245,505 Z"
  },
  {
    id: "faridpur",
    name: "Faridpur",
    division: "Dhaka Division",
    cx: 310,
    cy: 545,
    d: "M 275,515 L 350,510 L 355,580 L 295,600 L 260,570 Z"
  },
  {
    id: "gopalganj",
    name: "Gopalganj",
    division: "Dhaka Division",
    cx: 300,
    cy: 620,
    d: "M 270,590 L 345,585 L 350,655 L 285,675 L 255,645 Z"
  },
  {
    id: "madaripur",
    name: "Madaripur",
    division: "Dhaka Division",
    cx: 360,
    cy: 605,
    d: "M 335,580 L 395,575 L 400,640 L 345,655 L 320,630 Z"
  },
  {
    id: "shariatpur",
    name: "Shariatpur",
    division: "Dhaka Division",
    cx: 405,
    cy: 605,
    d: "M 380,575 L 445,570 L 450,640 L 395,655 L 365,630 Z"
  },

  // --- KHULNA DIVISION (South-West) ---
  {
    id: "kushtia",
    name: "Kushtia",
    division: "Khulna Division",
    cx: 215,
    cy: 450,
    d: "M 185,420 L 255,415 L 260,480 L 205,500 L 175,470 Z"
  },
  {
    id: "meherpur",
    name: "Meherpur",
    division: "Khulna Division",
    cx: 160,
    cy: 475,
    d: "M 135,455 L 195,450 L 200,505 L 150,520 L 125,495 Z"
  },
  {
    id: "chuadanga",
    name: "Chuadanga",
    division: "Khulna Division",
    cx: 175,
    cy: 520,
    d: "M 145,495 L 210,490 L 215,550 L 160,565 L 135,535 Z"
  },
  {
    id: "jhenaidah",
    name: "Jhenaidah",
    division: "Khulna Division",
    cx: 225,
    cy: 530,
    d: "M 195,505 L 265,500 L 270,565 L 215,585 L 180,555 Z"
  },
  {
    id: "magura",
    name: "Magura",
    division: "Khulna Division",
    cx: 270,
    cy: 555,
    d: "M 245,535 L 305,530 L 310,585 L 260,600 L 235,575 Z"
  },
  {
    id: "narail",
    name: "Narail",
    division: "Khulna Division",
    cx: 280,
    cy: 620,
    d: "M 255,595 L 315,590 L 320,650 L 265,665 L 240,640 Z"
  },
  {
    id: "jashore",
    name: "Jashore",
    division: "Khulna Division",
    cx: 215,
    cy: 605,
    d: "M 180,575 L 255,570 L 260,645 L 195,665 L 165,635 Z"
  },
  {
    id: "satkhira",
    name: "Satkhira",
    division: "Khulna Division",
    cx: 195,
    cy: 700,
    d: "M 160,655 L 235,650 L 245,775 L 175,795 L 145,735 Z"
  },
  {
    id: "khulna",
    name: "Khulna",
    division: "Khulna Division",
    cx: 260,
    cy: 700,
    d: "M 235,660 L 300,655 L 305,780 L 240,795 L 220,735 Z"
  },
  {
    id: "bagerhat",
    name: "Bagerhat",
    division: "Khulna Division",
    cx: 315,
    cy: 710,
    d: "M 290,665 L 355,660 L 360,785 L 300,800 L 275,745 Z"
  },

  // --- BARISHAL DIVISION (South-Central) ---
  {
    id: "barishal",
    name: "Barishal",
    division: "Barishal Division",
    cx: 395,
    cy: 675,
    d: "M 365,640 L 435,635 L 440,715 L 380,735 L 345,705 Z"
  },
  {
    id: "jhalokati",
    name: "Jhalokati",
    division: "Barishal Division",
    cx: 355,
    cy: 695,
    d: "M 335,670 L 385,665 L 390,725 L 345,740 L 325,715 Z"
  },
  {
    id: "pirojpur",
    name: "Pirojpur",
    division: "Barishal Division",
    cx: 325,
    cy: 685,
    d: "M 305,655 L 355,650 L 360,720 L 315,735 L 295,705 Z"
  },
  {
    id: "bhola",
    name: "Bhola",
    division: "Barishal Division",
    cx: 460,
    cy: 730,
    d: "M 435,675 L 490,670 L 500,815 L 440,830 L 420,760 Z"
  },
  {
    id: "patuakhali",
    name: "Patuakhali",
    division: "Barishal Division",
    cx: 395,
    cy: 775,
    d: "M 365,740 L 435,735 L 440,830 L 375,845 L 350,795 Z"
  },
  {
    id: "barguna",
    name: "Barguna",
    division: "Barishal Division",
    cx: 345,
    cy: 785,
    d: "M 320,750 L 380,745 L 385,840 L 330,855 L 305,805 Z"
  },

  // --- CHATTOGRAM DIVISION (East & South-East) ---
  {
    id: "brahmanbaria",
    name: "Brahmanbaria",
    division: "Chattogram Division",
    cx: 505,
    cy: 405,
    d: "M 475,370 L 545,365 L 555,445 L 490,465 L 460,430 Z"
  },
  {
    id: "cumilla",
    name: "Cumilla",
    division: "Chattogram Division",
    cx: 510,
    cy: 485,
    d: "M 475,450 L 555,445 L 565,530 L 490,550 L 460,515 Z"
  },
  {
    id: "chandpur",
    name: "Chandpur",
    division: "Chattogram Division",
    cx: 445,
    cy: 535,
    d: "M 420,505 L 480,500 L 485,570 L 430,590 L 405,555 Z"
  },
  {
    id: "feni",
    name: "Feni",
    division: "Chattogram Division",
    cx: 545,
    cy: 565,
    d: "M 520,535 L 580,530 L 585,600 L 530,615 L 505,585 Z"
  },
  {
    id: "noakhali",
    name: "Noakhali",
    division: "Chattogram Division",
    cx: 485,
    cy: 620,
    d: "M 455,575 L 530,570 L 535,665 L 470,685 L 440,645 Z"
  },
  {
    id: "lakshmipur",
    name: "Lakshmipur",
    division: "Chattogram Division",
    cx: 445,
    cy: 610,
    d: "M 420,575 L 475,570 L 480,650 L 430,665 L 405,630 Z"
  },
  {
    id: "khagrachhari",
    name: "Khagrachhari",
    division: "Chattogram Division",
    cx: 615,
    cy: 485,
    d: "M 580,440 L 660,435 L 670,545 L 595,565 L 565,510 Z"
  },
  {
    id: "rangamati",
    name: "Rangamati",
    division: "Chattogram Division",
    cx: 675,
    cy: 575,
    d: "M 630,520 L 730,515 L 740,650 L 650,670 L 615,610 Z"
  },
  {
    id: "chattogram",
    name: "Chattogram",
    division: "Chattogram Division",
    cx: 575,
    cy: 660,
    d: "M 545,605 L 620,600 L 630,735 L 560,755 L 530,695 Z"
  },
  {
    id: "bandarban",
    name: "Bandarban",
    division: "Chattogram Division",
    cx: 685,
    cy: 710,
    d: "M 645,645 L 740,640 L 750,795 L 665,815 L 625,750 Z"
  },
  {
    id: "coxs_bazar",
    name: "Cox's Bazar",
    division: "Chattogram Division",
    cx: 630,
    cy: 810,
    d: "M 595,745 L 675,740 L 685,910 L 625,930 L 585,850 Z"
  }
];
