#!/bin/bash


# Create and use dummy identity
echo "Creating dummy identity..."
dfx identity new dummy-community --disable-encryption || true
dfx identity use dummy-community

# Register a new community
echo "Registering dummy community..."
dfx canister call backend register '(record { name = "Lumora Official Hub"; registerAs = "community" })'


# Get the current timestamp in nanoseconds (1 week from now)
EXPIRED_TIME=$(( $(date +%s) * 1000000000 + 604800000000000 ))

# Sample project categories
CATEGORIES=(
    "Research" "Innovation" "Education" "Community" "Technology" "Sustainability" "Social Impact"
    "Environment" "Healthcare" "Agriculture" "Energy" "Transportation" "Waste Management" "Water"
    "Climate" "Conservation" "Biodiversity" "Urban Planning" "Rural Development" "Food Security"
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
    
    # Create project using dfx
    echo "Creating project $(($i + 1))/30: ${TITLES[$i]}"
    dfx canister call backend createProject "record { 
        title = \"${TITLES[$i]}\"; 
        description = \"${DESCRIPTIONS[$i]}\"; 
        expiredAt = ${EXPIRED_TIME}; 
        reward = ${RANDOM_REWARD}; 
        image = null; 
        category = \"${CATEGORIES[$(($i % 20))]}\"; 
        maxParticipants = ${RANDOM_MAX_PARTICIPANTS} 
    }"
done

echo "Successfully generated dummy projects!"

# Switch back to default identity
echo "Switching back to default identity..."
dfx identity use default