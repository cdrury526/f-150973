
export type ContractorType = 
  | 'General Contractor' 
  | 'Excavation Contractor' 
  | 'Foundation Contractor' 
  | 'Concrete Contractor' 
  | 'Framing Contractor' 
  | 'Roofing Contractor' 
  | 'Plumbing Contractor' 
  | 'Electrical Contractor' 
  | 'HVAC Contractor' 
  | 'Insulation Contractor' 
  | 'Drywall Contractor' 
  | 'Painting Contractor' 
  | 'Flooring Contractor' 
  | 'Cabinetry Contractor' 
  | 'Countertop Contractor' 
  | 'Tile Contractor' 
  | 'Masonry Contractor' 
  | 'Window and Door Contractor' 
  | 'Siding Contractor' 
  | 'Landscaping Contractor' 
  | 'Finish Carpenter' 
  | 'Trim Carpenter' 
  | 'Waterproofing Contractor' 
  | 'Security System Contractor' 
  | 'Solar Contractor';

export const contractorTypeDescriptions: Record<ContractorType, string> = {
  'General Contractor': 'Oversees the entire project',
  'Excavation Contractor': 'Site preparation and foundation digging',
  'Foundation Contractor': 'Creates the building\'s foundation',
  'Concrete Contractor': 'Handles all concrete work (slabs, driveways, etc.)',
  'Framing Contractor': 'Builds the structural framework',
  'Roofing Contractor': 'Installs and repairs roofing systems',
  'Plumbing Contractor': 'Installs water supply and drainage systems',
  'Electrical Contractor': 'Handles all electrical wiring and systems',
  'HVAC Contractor': 'Installs heating, ventilation, and air conditioning',
  'Insulation Contractor': 'Installs thermal and acoustic insulation',
  'Drywall Contractor': 'Installs interior wall and ceiling panels',
  'Painting Contractor': 'Applies paint and finishes to surfaces',
  'Flooring Contractor': 'Installs various types of flooring',
  'Cabinetry Contractor': 'Builds and installs cabinets',
  'Countertop Contractor': 'Fabricates and installs countertops',
  'Tile Contractor': 'Installs ceramic, porcelain, and stone tiles',
  'Masonry Contractor': 'Works with brick, stone, and concrete blocks',
  'Window and Door Contractor': 'Installs windows and doors',
  'Siding Contractor': 'Installs exterior cladding',
  'Landscaping Contractor': 'Designs and implements outdoor spaces',
  'Finish Carpenter': 'Handles detailed interior woodwork',
  'Trim Carpenter': 'Installs moldings and decorative elements',
  'Waterproofing Contractor': 'Prevents water intrusion',
  'Security System Contractor': 'Installs alarms and monitoring systems',
  'Solar Contractor': 'Installs photovoltaic and solar thermal systems'
};

export interface Contractor {
  id: string;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  contactName: string;
  status: 'Active' | 'Inactive' | 'On Hold';
  contractorType: ContractorType;
}
