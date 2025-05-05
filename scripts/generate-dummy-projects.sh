#!/bin/bash


# Create and use dummy identity
echo "Creating dummy identity..."
dfx identity new dummy-community --disable-encryption || true
dfx identity use dummy-community

# Register a new community
echo "Registering dummy community..."
dfx canister call backend register '(record { name = "Lumora Official Hub"; registerAs = "community" })'

# Get current timestamp in nanoseconds
CURRENT_TIME=$(date +%s)
NANO_MULTIPLIER=1000000000

# Calculate various timestamps
NOW=$(( CURRENT_TIME * NANO_MULTIPLIER ))
ONE_WEEK=$(( 7 * 24 * 60 * 60 * NANO_MULTIPLIER ))
TWO_WEEKS=$(( 14 * 24 * 60 * 60 * NANO_MULTIPLIER ))
ONE_MONTH=$(( 30 * 24 * 60 * 60 * NANO_MULTIPLIER ))

# Sample project categories
CATEGORIES=(
    "energy"
    "water"
    "waste"
    "transportation"
    "agriculture"
    "forestry"
    "biodiversity"
)

# Sample impacts
IMPACTS=(
    "3.5 tons plastic removed"
    "2.8 tons CO2 reduced"
    "4.2 tons waste recycled"
    "5.0 tons emissions avoided"
    "2.5 tons plastic collected"
    "3.0 tons food waste saved"
    "6.5 tons carbon offset"
    "4.8 tons water cleaned"
    "2.2 tons e-waste recycled"
    "7.0 tons organic waste processed"
    "1.8 tons plastic upcycled"
    "4.5 tons emissions reduced"
    "3.2 tons waste prevented"
    "5.5 tons water saved"
    "2.7 tons carbon captured"
)

# Sample addresses (Indonesian cities)
ADDRESSES=(
    "Bandung, Indonesia"
    "Jakarta Selatan, Indonesia"
    "Yogyakarta, Indonesia"
    "Surabaya, Indonesia"
    "Malang, Indonesia"
    "Semarang, Indonesia"
    "Medan, Indonesia"
    "Bali, Indonesia"
    "Palembang, Indonesia"
    "Makassar, Indonesia"
    "Bogor, Indonesia"
    "Manado, Indonesia"
    "Padang, Indonesia"
    "Balikpapan, Indonesia"
    "Pontianak, Indonesia"
)

# Sample project titles
TITLES=(
    "Open Source Research Collaboration"
    "Student Innovation Challenge" 
    "Educational Content Creation"
    "Community Knowledge Sharing"
    "Tech Mentorship Program"
    "Sustainable Development Workshop"
    "Social Impact Documentation"
    "Environmental Data Collection"
    "Healthcare Access Initiative"
    "Smart Agriculture Solutions"
    "Renewable Energy Project"
    "Green Transportation Study"
    "Zero Waste Campaign"
    "Clean Water Initiative"
    "Climate Change Research"
    "Wildlife Conservation Project"
    "Biodiversity Mapping"
    "Smart City Planning"
    "Rural Connectivity Project"
    "Food Security Program"
    "Ocean Cleanup Initiative"
    "Forest Conservation Plan"
    "Air Quality Monitoring"
    "Sustainable Housing Design"
    "Green Energy Education"
    "Eco-Tourism Development"
    "Waste Recycling Program"
    "Water Conservation Study"
    "Urban Farming Project"
    "Sustainable Fishing Initiative"
)

# Sample project descriptions
DESCRIPTIONS=(
    "Collaborate on research projects focusing on emerging technologies and their impact on society"
    "Join a challenge to develop innovative solutions for local community problems"
    "Create educational content to help others learn about technology and innovation"
    "Share knowledge and experiences through community-driven learning sessions"
    "Participate in mentorship program to guide aspiring technologists"
    "Develop sustainable solutions for environmental challenges through workshops"
    "Document and share stories of social impact initiatives in technology"
    "Collect and analyze environmental data for conservation efforts"
    "Improve healthcare accessibility in underserved communities"
    "Implement smart agriculture solutions for sustainable farming"
    "Develop renewable energy solutions for rural areas"
    "Study and propose green transportation alternatives"
    "Launch community-wide zero waste initiatives"
    "Implement clean water solutions in developing regions"
    "Research climate change impacts on local ecosystems"
    "Protect and monitor local wildlife populations"
    "Map and preserve local biodiversity"
    "Plan and implement smart city solutions"
    "Connect rural communities through technology"
    "Ensure food security through sustainable practices"
    "Organize ocean cleanup and preservation efforts"
    "Protect and restore forest ecosystems"
    "Monitor and improve urban air quality"
    "Design sustainable and affordable housing"
    "Educate communities about renewable energy"
    "Develop sustainable tourism practices"
    "Implement effective waste recycling systems"
    "Study and implement water conservation methods"
    "Create urban farming solutions"
    "Develop sustainable fishing practices"
)

# Loop through and create projects
echo "Creating projects..."
for i in {0..29}; do
    # Generate random reward between 1-20
    RANDOM_REWARD=$((RANDOM % 20 + 1))
    # Generate random max participants between 100-250
    RANDOM_MAX_PARTICIPANTS=$((RANDOM % 151 + 100))
    # Get random impact and address (cycling through the arrays)
    IMPACT_INDEX=$((i % ${#IMPACTS[@]}))
    ADDRESS_INDEX=$((i % ${#ADDRESSES[@]}))
    
    # Calculate dates based on project index to create a mix of statuses
    case $((i % 4)) in
        0) # Active projects (current - 1 week to current + 2 weeks)
            START_DATE=$((NOW - ONE_WEEK))
            END_DATE=$((NOW + TWO_WEEKS))
            ;;
        1) # Upcoming projects (current + 1 week to current + 1 month)
            START_DATE=$((NOW + ONE_WEEK))
            END_DATE=$((NOW + ONE_MONTH))
            ;;
        2) # Closed projects (current - 1 month to current - 1 week)
            START_DATE=$((NOW - ONE_MONTH))
            END_DATE=$((NOW - ONE_WEEK))
            ;;
        3) # Mix of active/upcoming (current to current + 2 weeks)
            START_DATE=$((NOW))
            END_DATE=$((NOW + TWO_WEEKS))
            ;;
    esac
    
    # Create project using dfx
    echo "Creating project $(($i + 1))/30: ${TITLES[$i]}"
    dfx canister call backend createProject "record { 
        title = \"${TITLES[$i]}\"; 
        description = \"${DESCRIPTIONS[$i]}\"; 
        startDate = ${START_DATE}; 
        expiredAt = ${END_DATE}; 
        reward = ${RANDOM_REWARD}; 
        imageUrl = null; 
        category = variant { ${CATEGORIES[$(($i % 7))]} }; 
        maxParticipants = ${RANDOM_MAX_PARTICIPANTS};
        impact = \"${IMPACTS[$IMPACT_INDEX]}\";
        address = \"${ADDRESSES[$ADDRESS_INDEX]}\"
    }"
done

echo "Successfully generated dummy projects!"

# Switch back to default identity
echo "Switching back to lumora identity..."
dfx identity use lumora