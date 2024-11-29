const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

const exercises = [
    {
        name: 'Toes To Bar',
        primaryMuscles: ['core'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'A challenging core exercise performed hanging from a pull-up bar.',
        instructions: [
            'Hang from a pull-up bar with hands shoulder-width apart',
            'Keep your arms straight and engage your core',
            'Lift your legs while keeping them straight',
            'Touch your toes to the bar',
            'Lower your legs with control'
        ]
    },
    {
        name: 'Torso Rotation (Machine)',
        primaryMuscles: ['core'],
        secondaryMuscles: ['back'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'A machine-based exercise targeting the obliques and rotational core muscles.',
        instructions: [
            'Sit in the machine with your spine neutral',
            'Grasp the handles or pad',
            'Rotate your torso against the resistance',
            'Return to center with control'
        ]
    },
    {
        name: 'Trap Bar Deadlift',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['back', 'core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'A deadlift variation using a hexagonal bar that puts less stress on the lower back.',
        instructions: [
            'Stand inside the trap bar with feet shoulder-width apart',
            'Hinge at hips and bend knees to grasp handles',
            'Keep chest up and back straight',
            'Drive through heels to stand up with the weight',
            'Return weight to ground with control'
        ]
    },
    {
        name: 'Triceps Dip',
        primaryMuscles: ['arms'],
        secondaryMuscles: ['chest', 'shoulders'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'A compound exercise that primarily targets the triceps.',
        instructions: [
            'Grip parallel bars with straight arms',
            'Lower your body by bending your elbows',
            'Keep your elbows close to your body',
            'Push back up to starting position'
        ]
    },
    {
        name: 'Triceps Dip (Assisted)',
        primaryMuscles: ['arms'],
        secondaryMuscles: ['chest', 'shoulders'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'A machine-assisted version of the triceps dip for those building strength.',
        instructions: [
            'Kneel on the assist platform',
            'Grip parallel bars with straight arms',
            'Lower your body by bending your elbows',
            'Push back up to starting position'
        ]
    },
    {
        name: 'Triceps Extension',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'A basic triceps extension exercise.',
        instructions: [
            'Hold weight overhead with both hands',
            'Lower weight behind head by bending elbows',
            'Keep upper arms stationary',
            'Extend arms back to starting position'
        ]
    },
    {
        name: 'Triceps Extension (Barbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'An isolation exercise for the triceps using a barbell.',
        instructions: [
            'Lie on a bench with feet flat on the ground',
            'Hold barbell with narrow grip above chest',
            'Lower the bar toward your forehead by bending elbows',
            'Extend arms back to starting position'
        ]
    },
    {
        name: 'Triceps Extension (Cable)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'A cable-based isolation exercise for the triceps.',
        instructions: [
            'Face away from cable machine, grab rope attachment',
            'Keep elbows at sides and bent',
            'Extend arms down, pushing rope attachment down',
            'Return to starting position with control'
        ]
    },
    {
        name: 'Triceps Extension (Dumbbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'An isolation exercise for the triceps using dumbbells.',
        instructions: [
            'Hold dumbbell with both hands above head',
            'Lower dumbbell behind head by bending elbows',
            'Keep upper arms stationary',
            'Extend arms back to starting position'
        ]
    },
    {
        name: 'Triceps Extension (Machine)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'A machine-based isolation exercise for the triceps.',
        instructions: [
            'Adjust seat height appropriately',
            'Grasp handles with overhand grip',
            'Push handles down by extending arms',
            'Return to starting position with control'
        ]
    },
    {
        name: 'Triceps Pushdown (Cable)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'A cable exercise that isolates the triceps muscles.',
        instructions: [
            'Face cable machine and grab the bar with overhand grip',
            'Keep elbows tucked at sides',
            'Push bar down until arms are fully extended',
            'Slowly return to starting position keeping tension on triceps'
        ]
    },
    {
        name: 'Upright Row (Barbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'A compound exercise targeting the upper back and shoulders.',
        instructions: [
            'Stand with feet shoulder-width apart',
            'Hold barbell with overhand grip in front of thighs',
            'Pull barbell straight up toward chin',
            'Keep elbows higher than forearms',
            'Lower barbell back to starting position'
        ]
    },
    {
        name: 'Upright Row (Cable)',
        primaryMuscles: ['arms'],
        secondaryMuscles: ['shoulders', 'back'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'A cable variation of the upright row.',
        instructions: [
            'Stand facing cable machine',
            'Grasp cable attachment with overhand grip',
            'Pull straight up toward chin',
            'Keep elbows higher than forearms',
            'Lower with control'
        ]
    },
    {
        name: 'Upright Row (Dumbbell)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['back', 'arms'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'A dumbbell variation of the upright row targeting shoulders.',
        instructions: [
            'Stand with dumbbells in front of thighs',
            'Pull dumbbells straight up toward chin',
            'Keep elbows higher than forearms',
            'Lower dumbbells back to starting position'
        ]
    },
    {
        name: 'Step-up',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'A unilateral leg exercise that builds strength and balance.',
        instructions: [
            'Stand in front of a sturdy platform or box',
            'Step up with one foot, driving through your heel',
            'Bring your other foot up onto the platform',
            'Step back down with control',
            'Alternate legs with each rep'
        ]
    },
    {
        name: 'Stiff Leg Deadlift (Barbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['legs', 'core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'A deadlift variation that targets the hamstrings and lower back.',
        instructions: [
            'Stand with feet hip-width apart holding barbell',
            'Keep legs straight but not locked',
            'Hinge at hips, pushing them back',
            'Lower bar along legs while maintaining a flat back',
            'Return to starting position by driving hips forward'
        ]
    },
    {
        name: 'Stiff Leg Deadlift (Dumbbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['back', 'core'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'A dumbbell variation of the stiff leg deadlift.',
        instructions: [
            'Hold dumbbells in front of thighs',
            'Keep legs straight but not locked',
            'Hinge at hips while maintaining flat back',
            'Lower weights along legs',
            'Return to starting position by driving hips forward'
        ]
    },
    {
        name: 'Straight Leg Deadlift (Band)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['back', 'core'],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'A band variation of the straight leg deadlift focusing on hamstrings.',
        instructions: [
            'Stand on resistance band with feet shoulder-width apart',
            'Grasp band handles at thighs',
            'Keep legs straight but not locked',
            'Hinge at hips while maintaining flat back',
            'Return to starting position'
        ]
    },
    {
        name: 'Stretching',
        primaryMuscles: ['other'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'mobility',
        isPublic: true,
        description: 'Various stretching exercises to improve flexibility and mobility.',
        instructions: [
            'Choose target muscle group',
            'Perform stretch with proper form',
            'Hold stretch for 15-30 seconds',
            'Avoid bouncing or jerking movements',
            'Breathe deeply and regularly'
        ]
    },
    {
        name: 'Strict Military Press (Barbell)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['arms', 'core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'A strict overhead pressing movement targeting shoulders.',
        instructions: [
            'Stand with feet shoulder-width apart',
            'Hold barbell at shoulder level',
            'Press bar overhead while keeping core tight',
            'Fully extend arms without leaning back',
            'Lower bar back to shoulders with control'
        ]
    },
    {
        name: 'Sumo Deadlift (Barbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['legs', 'core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'A wide-stance deadlift variation.',
        instructions: [
            'Stand with wide stance, toes pointed out',
            'Grip barbell inside legs',
            'Keep chest up, back flat',
            'Drive through heels and extend hips and knees',
            'Return weight to ground with control'
        ]
    },
    {
        name: 'Sumo Deadlift High Pull (Barbell)',
        primaryMuscles: ['full body'],
        secondaryMuscles: ['shoulders', 'back'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'A explosive full-body movement combining a sumo deadlift with a high pull.',
        instructions: [
            'Start in sumo deadlift position',
            'Explosively pull weight up',
            'Continue pull until bar reaches upper chest',
            'Keep elbows high during pull',
            'Return weight to ground with control'
        ]
    },
    {
        name: 'Superman',
        primaryMuscles: ['core'],
        secondaryMuscles: ['back'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'A bodyweight exercise targeting the lower back and core.',
        instructions: [
            'Lie face down on mat',
            'Extend arms forward and legs back',
            'Lift arms and legs off ground simultaneously',
            'Hold position briefly',
            'Lower back to starting position'
        ]
    },
    {
        name: 'Swimming',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['full body'],
        equipment: 'other',
        type: 'cardio',
        isPublic: true,
        description: 'Full-body cardio exercise performed in water.',
        instructions: [
            'Choose swimming stroke',
            'Maintain proper form throughout',
            'Focus on breathing rhythm',
            'Keep body streamlined',
            'Maintain consistent pace'
        ]
    },
    {
        name: 'Snowboarding',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['legs', 'core'],
        equipment: 'other',
        type: 'cardio',
        isPublic: true,
        description: 'Winter sport that provides a full-body workout while riding down snow-covered slopes.',
        instructions: [
            'Maintain proper stance on snowboard',
            'Use core and legs for balance and control',
            'Shift weight to control direction',
            'Keep knees slightly bent for stability',
            'Use edges for speed control'
        ]
    },
    {
        name: 'Split Jerk (Barbell)',
        primaryMuscles: ['olympic'],
        secondaryMuscles: ['shoulders', 'legs'],
        equipment: 'barbell',
        type: 'olympic',
        isPublic: true,
        description: 'Olympic weightlifting movement that involves explosively pressing a barbell overhead.',
        instructions: [
            'Start with barbell at shoulders',
            'Slightly bend knees and explosively drive bar overhead',
            'Split legs into lunge position',
            'Lock out arms overhead',
            'Return to standing position with control'
        ]
    },
    {
        name: 'Squat (Band)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'A squat variation using resistance bands for added tension.',
        instructions: [
            'Stand on resistance band with feet shoulder-width apart',
            'Hold band at shoulders or extend above head',
            'Perform squat movement with proper form',
            'Keep chest up and core engaged',
            'Push through heels to return to start'
        ]
    },
    {
        name: 'Squat (Barbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core', 'back'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'The classic barbell back squat, a fundamental strength exercise.',
        instructions: [
            'Position bar on upper back',
            'Feet shoulder-width apart, toes slightly out',
            'Break at hips and knees simultaneously',
            'Keep chest up and core tight',
            'Squat until thighs are parallel or below'
        ]
    },
    {
        name: 'Squat (Bodyweight)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Basic squat movement using only body weight.',
        instructions: [
            'Stand with feet shoulder-width apart',
            'Keep arms in front for balance',
            'Lower body as if sitting back into a chair',
            'Keep chest up and core engaged',
            'Push through heels to stand'
        ]
    },
    {
        name: 'Squat (Dumbbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Squat variation performed with dumbbells for added resistance.',
        instructions: [
            'Hold dumbbells at shoulders or sides',
            'Feet shoulder-width apart',
            'Perform squat movement with proper form',
            'Keep chest up and core engaged',
            'Push through heels to return to start'
        ]
    },
    {
        name: 'Squat (Machine)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based squat that provides stability and guided movement.',
        instructions: [
            'Adjust machine to proper height',
            'Position shoulders under pads',
            'Feet shoulder-width apart',
            'Perform squat movement',
            'Control weight throughout movement'
        ]
    },
    {
        name: 'Squat (Smith Machine)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Squat performed on a Smith machine for guided movement pattern.',
        instructions: [
            'Position bar on upper back',
            'Feet slightly in front of bar',
            'Unrack weight and perform squat',
            'Keep core tight throughout',
            'Re-rack weight with control'
        ]
    },
    {
        name: 'Squat Row (Band)',
        primaryMuscles: ['full body'],
        secondaryMuscles: ['legs', 'back'],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'Combination movement that pairs a squat with a rowing motion.',
        instructions: [
            'Anchor band at chest height',
            'Hold band and step back to create tension',
            'Squat while keeping arms extended',
            'As you stand, perform a rowing motion',
            'Control both movements with good form'
        ]
    },
    {
        name: 'Standing Calf Raise (Barbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Isolated calf exercise using a barbell for resistance.',
        instructions: [
            'Place barbell across upper back',
            'Stand on elevated surface with heels off edge',
            'Lower heels below platform level',
            'Rise up onto toes as high as possible',
            'Lower with control and repeat'
        ]
    },
    {
        name: 'Standing Calf Raise (Bodyweight)',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Basic calf raise using only body weight.',
        instructions: [
            'Stand on elevated surface with heels off edge',
            'Balance yourself with light wall touch if needed',
            'Lower heels below platform level',
            'Rise up onto toes as high as possible',
            'Lower with control and repeat'
        ]
    },
    {
        name: 'Standing Calf Raise (Dumbbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Calf raise performed with dumbbells for added resistance.',
        instructions: [
            'Hold dumbbells at sides',
            'Stand on elevated surface with heels off edge',
            'Lower heels below platform level',
            'Rise up onto toes as high as possible',
            'Lower with control and repeat'
        ]
    },
    {
        name: 'Standing Calf Raise (Machine)',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based calf raise for isolated calf development.',
        instructions: [
            'Position shoulders under pads',
            'Stand on platform with balls of feet',
            'Lower heels below platform level',
            'Rise up onto toes as high as possible',
            'Lower with control and repeat'
        ]
    },
    {
        name: 'Standing Calf Raise (Smith Machine)',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Calf raise performed using a Smith machine for stability.',
        instructions: [
            'Position bar across upper back',
            'Stand on platform with balls of feet',
            'Lower heels below platform level',
            'Rise up onto toes as high as possible',
            'Lower with control and repeat'
        ]
    },
    {
        name: 'Shrug (Machine)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['shoulders'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based exercise targeting the upper trapezius muscles.',
        instructions: [
            'Adjust machine to appropriate height',
            'Grasp handles with both hands',
            'Elevate shoulders straight up toward ears',
            'Hold briefly at the top',
            'Lower shoulders back down with control'
        ]
    },
    {
        name: 'Shrug (Smith Machine)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['shoulders'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Shoulder shrug performed using a Smith machine for stability.',
        instructions: [
            'Position bar in front of thighs',
            'Grasp bar with overhand grip',
            'Elevate shoulders straight up toward ears',
            'Hold briefly at the top',
            'Lower shoulders back down with control'
        ]
    },
    {
        name: 'Side Bend (Band)',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'Lateral core exercise using resistance bands.',
        instructions: [
            'Stand on band with feet shoulder-width apart',
            'Hold band at side',
            'Bend sideways against band resistance',
            'Return to starting position',
            'Repeat on opposite side'
        ]
    },
    {
        name: 'Side Bend (Cable)',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Cable machine variation of the side bend targeting obliques.',
        instructions: [
            'Stand sideways to cable machine',
            'Grasp handle at side',
            'Bend away from machine',
            'Return to starting position with control',
            'Repeat on opposite side'
        ]
    },
    {
        name: 'Side Bend (Dumbbell)',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Dumbbell variation of the side bend for oblique development.',
        instructions: [
            'Hold dumbbell in one hand',
            'Stand with feet shoulder-width apart',
            'Bend sideways toward weighted side',
            'Return to starting position',
            'Complete all reps before switching sides'
        ]
    },
    {
        name: 'Side Plank',
        primaryMuscles: ['core'],
        secondaryMuscles: ['shoulders'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Isometric core exercise targeting obliques and lateral stability.',
        instructions: [
            'Lie on side with elbow under shoulder',
            'Lift hips off ground creating straight line',
            'Hold position with good form',
            'Keep body aligned and core engaged',
            'Switch sides and repeat'
        ]
    },
    {
        name: 'Single Leg Bridge',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core', 'glutes'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Unilateral variation of the glute bridge exercise.',
        instructions: [
            'Lie on back with knees bent',
            'Extend one leg straight',
            'Push through heel of grounded foot',
            'Lift hips off ground',
            'Lower with control and repeat'
        ]
    },
    {
        name: 'Sit Up',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Classic core exercise targeting the abdominal muscles.',
        instructions: [
            'Lie on back with knees bent',
            'Place hands behind head',
            'Lift upper body off ground',
            'Engage core throughout movement',
            'Lower back down with control'
        ]
    },
    {
        name: 'Skating',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['legs'],
        equipment: 'other',
        type: 'cardio',
        isPublic: true,
        description: 'Cardiovascular exercise performed on skates.',
        instructions: [
            'Maintain proper skating stance',
            'Push off with each leg alternately',
            'Keep core engaged for balance',
            'Use arms for momentum',
            'Maintain consistent pace'
        ]
    },
    {
        name: 'Skiing',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['legs', 'core'],
        equipment: 'other',
        type: 'cardio',
        isPublic: true,
        description: 'Winter sport providing full-body cardiovascular workout.',
        instructions: [
            'Maintain athletic skiing stance',
            'Use poles for balance and timing',
            'Keep weight centered over skis',
            'Use legs to control speed and turns',
            'Maintain awareness of surroundings'
        ]
    },
    {
        name: 'Skullcrusher (Barbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Triceps isolation exercise using a barbell.',
        instructions: [
            'Lie on bench holding barbell over chest',
            'Keep upper arms stationary',
            'Lower bar toward forehead by bending elbows',
            'Extend arms back to start position',
            'Maintain control throughout movement'
        ]
    },
    {
        name: 'Skullcrusher (Dumbbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Dumbbell variation of the skullcrusher for triceps.',
        instructions: [
            'Lie on bench holding dumbbells over chest',
            'Keep upper arms stationary',
            'Lower weights toward forehead',
            'Extend arms back to start position',
            'Maintain control throughout movement'
        ]
    },
    {
        name: 'Snatch (Barbell)',
        primaryMuscles: ['olympic'],
        secondaryMuscles: ['full body'],
        equipment: 'barbell',
        type: 'olympic',
        isPublic: true,
        description: 'Olympic weightlifting movement that takes the bar from floor to overhead.',
        instructions: [
            'Start with bar at shin height',
            'Explosively pull bar upward',
            'Pull yourself under the bar',
            'Catch bar overhead in squat position',
            'Stand up while stabilizing weight'
        ]
    },
    {
        name: 'Snatch Pull (Barbell)',
        primaryMuscles: ['olympic'],
        secondaryMuscles: ['back', 'legs'],
        equipment: 'barbell',
        type: 'olympic',
        isPublic: true,
        description: 'Partial movement of the snatch focusing on the pull.',
        instructions: [
            'Start with bar at shin height',
            'Pull bar explosively upward',
            'Shrug shoulders at top of pull',
            'Keep bar close to body',
            'Return bar to start position with control'
        ]
    },
    {
        name: 'Seated Calf Raise (Machine)',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based seated calf raise targeting the soleus muscle.',
        instructions: [
            'Sit in machine with knees bent at 90 degrees',
            'Place balls of feet on platform',
            'Lower heels as far as possible',
            'Raise heels by pushing through balls of feet',
            'Lower with control and repeat'
        ]
    },
    {
        name: 'Seated Calf Raise (Plate Loaded)',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Plate-loaded version of the seated calf raise.',
        instructions: [
            'Sit with knees bent at 90 degrees',
            'Place weight across thighs',
            'Position balls of feet on platform',
            'Raise and lower heels through full range',
            'Control weight throughout movement'
        ]
    },
    {
        name: 'Seated Leg Curl (Machine)',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based isolation exercise for hamstrings.',
        instructions: [
            'Adjust machine to fit your body',
            'Sit with back firmly against pad',
            'Place legs on top of padded lever',
            'Curl weight up towards buttocks',
            'Return to start position with control'
        ]
    },
    {
        name: 'Seated Leg Press (Machine)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based compound leg exercise.',
        instructions: [
            'Sit in machine with back against pad',
            'Place feet shoulder-width apart on platform',
            'Lower weight by bending knees',
            'Push through heels to return to start',
            'Dont lock knees at top of movement'
        ]
    },
    {
        name: 'Seated Overhead Press (Barbell)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['arms', 'core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Seated variation of the overhead press.',
        instructions: [
            'Sit with back supported',
            'Hold barbell at shoulder level',
            'Press weight overhead',
            'Lower with control to shoulders',
            'Keep core tight throughout'
        ]
    },
    {
        name: 'Seated Overhead Press (Dumbbell)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['arms', 'core'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Dumbbell variation of seated overhead press.',
        instructions: [
            'Sit with back supported',
            'Hold dumbbells at shoulder level',
            'Press weights overhead',
            'Lower with control to shoulders',
            'Keep core engaged throughout'
        ]
    },
    {
        name: 'Seated Palms Up Wrist Curl',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Isolation exercise for forearm flexors.',
        instructions: [
            'Sit with forearms resting on thighs',
            'Hold weight with palms facing up',
            'Lower weight by extending wrists',
            'Curl weight up by flexing wrists',
            'Keep forearms stationary'
        ]
    },
    {
        name: 'Seated Row (Cable)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms', 'shoulders'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Cable machine rowing exercise for back development.',
        instructions: [
            'Sit at cable machine with feet braced',
            'Grasp handle with both hands',
            'Pull handle to torso keeping back straight',
            'Squeeze shoulder blades together',
            'Return to start position with control'
        ]
    },
    {
        name: 'Seated Row (Machine)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms', 'shoulders'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based rowing exercise.',
        instructions: [
            'Sit at machine with chest against pad',
            'Grasp handles with both hands',
            'Pull handles to torso',
            'Squeeze shoulder blades together',
            'Return to start position with control'
        ]
    },
    {
        name: 'Seated Wide-Grip Row (Cable)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms', 'shoulders'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Wide-grip variation of the seated cable row.',
        instructions: [
            'Sit at cable machine with feet braced',
            'Grasp wide bar with overhand grip',
            'Pull bar to upper abdomen',
            'Keep elbows high during pull',
            'Return to start position with control'
        ]
    },
    {
        name: 'Shoulder Press (Machine)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['arms'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based overhead pressing movement.',
        instructions: [
            'Adjust seat to appropriate height',
            'Grasp handles at shoulder level',
            'Press weight overhead',
            'Lower with control to start position',
            'Keep core engaged throughout'
        ]
    },
    {
        name: 'Shoulder Press (Plate Loaded)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['arms'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Plate-loaded machine shoulder press.',
        instructions: [
            'Adjust seat to appropriate height',
            'Grasp handles at shoulder level',
            'Press weight overhead',
            'Lower with control to start position',
            'Maintain proper posture throughout'
        ]
    },
    {
        name: 'Shrug (Barbell)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['back'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Barbell exercise targeting the upper trapezius.',
        instructions: [
            'Hold barbell in front of thighs',
            'Keep arms straight',
            'Elevate shoulders straight up',
            'Hold briefly at top',
            'Lower with control'
        ]
    },
    {
        name: 'Shrug (Dumbbell)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['back'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Dumbbell variation of the shoulder shrug.',
        instructions: [
            'Hold dumbbells at sides',
            'Keep arms straight',
            'Elevate shoulders straight up',
            'Hold briefly at top',
            'Lower with control'
        ]
    },
    {
        name: 'Reverse Crunch',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Core exercise focusing on lower abdominals.',
        instructions: [
            'Lie on back with legs raised',
            'Keep lower back pressed against floor',
            'Lift hips off ground by curling pelvis up',
            'Lower with control to start position',
            'Maintain controlled breathing throughout'
        ]
    },
    {
        name: 'Reverse Curl (Band)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'Band variation of reverse curl targeting biceps.',
        instructions: [
            'Attach band to sturdy point at ground level',
            'Hold band with palms facing down',
            'Curl hands up toward shoulders',
            'Keep elbows at sides',
            'Lower with control'
        ]
    },
    {
        name: 'Reverse Curl (Barbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Barbell curl performed with palms facing down.',
        instructions: [
            'Hold barbell with palms facing down',
            'Keep elbows at sides',
            'Curl weight toward shoulders',
            'Maintain controlled movement',
            'Lower to starting position'
        ]
    },
    {
        name: 'Reverse Curl (Dumbbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Dumbbell curl performed with palms facing down.',
        instructions: [
            'Hold dumbbells with palms facing down',
            'Keep elbows at sides',
            'Curl weights toward shoulders',
            'Maintain controlled movement',
            'Lower to starting position'
        ]
    },
    {
        name: 'Reverse Fly (Cable)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['back'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Cable exercise targeting rear deltoids.',
        instructions: [
            'Stand between cable machines',
            'Grab handles with arms crossed',
            'Pull arms out to sides',
            'Squeeze shoulder blades together',
            'Return to start position with control'
        ]
    },
    {
        name: 'Reverse Fly (Dumbbell)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['back'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Dumbbell exercise for rear deltoid development.',
        instructions: [
            'Bend forward at hips',
            'Hold dumbbells with palms facing each other',
            'Raise arms out to sides',
            'Squeeze shoulder blades together',
            'Lower with control'
        ]
    },
    {
        name: 'Reverse Fly (Machine)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['back'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based exercise for rear deltoids.',
        instructions: [
            'Sit facing chest pad',
            'Grasp handles with palms down',
            'Pull handles out to sides',
            'Squeeze shoulder blades together',
            'Return to start position with control'
        ]
    },
    {
        name: 'Reverse Grip Concentration Curl',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Isolation exercise for biceps using reverse grip.',
        instructions: [
            'Sit on bench with elbow on inner thigh',
            'Hold dumbbell with palm facing down',
            'Curl weight toward shoulder',
            'Keep upper arm stationary',
            'Lower with control'
        ]
    },
    {
        name: 'Reverse Plank',
        primaryMuscles: ['core'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Bodyweight exercise targeting posterior chain.',
        instructions: [
            'Sit with legs extended',
            'Place hands behind you, fingers pointing toward feet',
            'Lift hips off ground',
            'Keep body straight from head to heels',
            'Hold position'
        ]
    },
    {
        name: 'Romanian Deadlift (Barbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['legs', 'core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Hip-hinge movement targeting hamstrings and lower back.',
        instructions: [
            'Hold barbell at hip level',
            'Keep slight bend in knees',
            'Hinge at hips pushing them back',
            'Lower bar along thighs',
            'Return to standing by driving hips forward'
        ]
    },
    {
        name: 'Romanian Deadlift (Dumbbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['back', 'core'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Dumbbell variation of Romanian deadlift.',
        instructions: [
            'Hold dumbbells in front of thighs',
            'Keep slight bend in knees',
            'Hinge at hips pushing them back',
            'Lower weights along thighs',
            'Return to standing by driving hips forward'
        ]
    },
    {
        name: 'Rowing (Machine)',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['back', 'legs'],
        equipment: 'machine',
        type: 'cardio',
        isPublic: true,
        description: 'Full-body cardio exercise on rowing machine.',
        instructions: [
            'Sit on rower and strap feet in',
            'Grab handle with overhand grip',
            'Push with legs then pull with arms',
            'Return to start position with control',
            'Maintain steady rhythm'
        ]
    },
    {
        name: 'Running',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['legs'],
        equipment: 'bodyweight',
        type: 'cardio',
        isPublic: true,
        description: 'Basic cardiovascular exercise.',
        instructions: [
            'Start at comfortable pace',
            'Land midfoot with each step',
            'Keep arms relaxed and moving',
            'Maintain upright posture',
            'Breathe rhythmically'
        ]
    },
    {
        name: 'Running (Treadmill)',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['legs'],
        equipment: 'machine',
        type: 'cardio',
        isPublic: true,
        description: 'Cardiovascular exercise performed on treadmill.',
        instructions: [
            'Start at walking pace',
            'Increase speed gradually',
            'Maintain good posture',
            'Use arms naturally',
            'Stay centered on belt'
        ]
    },
    {
        name: 'Russian Twist',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Rotational core exercise targeting obliques.',
        instructions: [
            'Sit with knees bent and feet off ground',
            'Lean back slightly maintaining straight back',
            'Clasp hands together or hold weight',
            'Rotate torso side to side',
            'Keep feet elevated throughout'
        ]
    },
    {
        name: 'Preacher Curl (Dumbbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Isolation exercise for biceps using preacher bench.',
        instructions: [
            'Sit at preacher bench with armpits against top pad',
            'Hold dumbbell with palm facing up',
            'Lower weight with full arm extension',
            'Curl weight up to shoulder level',
            'Keep upper arms in contact with pad throughout'
        ]
    },
    {
        name: 'Preacher Curl (Machine)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based preacher curl for biceps.',
        instructions: [
            'Adjust seat height appropriately',
            'Place arms against pad',
            'Grasp handles with palms up',
            'Curl weight up to shoulders',
            'Lower with control'
        ]
    },
    {
        name: 'Press Under (Barbell)',
        primaryMuscles: ['olympic'],
        secondaryMuscles: ['shoulders', 'legs'],
        equipment: 'barbell',
        type: 'olympic',
        isPublic: true,
        description: 'Olympic weightlifting movement drill.',
        instructions: [
            'Start with barbell at shoulders',
            'Slightly bend knees',
            'Press bar while dipping under',
            'Lock out arms overhead',
            'Return to starting position'
        ]
    },
    {
        name: 'Pull Up',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms', 'shoulders'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Upper body compound exercise using body weight.',
        instructions: [
            'Hang from pull-up bar with overhand grip',
            'Pull body up until chin over bar',
            'Keep core engaged throughout',
            'Lower with control to start position',
            'Maintain steady breathing'
        ]
    },
    {
        name: 'Pull Up (Assisted)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms', 'shoulders'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-assisted version of pull-up.',
        instructions: [
            'Adjust assist weight appropriately',
            'Grasp bar with overhand grip',
            'Pull body up until chin over bar',
            'Lower with control',
            'Keep core engaged throughout'
        ]
    },
    {
        name: 'Pull Up (Band)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms', 'shoulders'],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'Band-assisted pull-up for building strength.',
        instructions: [
            'Loop resistance band around pull-up bar',
            'Place foot or knee in band',
            'Perform pull-up with band assistance',
            'Lower with control',
            'Maintain proper form throughout'
        ]
    },
    {
        name: 'Pullover (Dumbbell)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['back', 'shoulders'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Upper body exercise targeting chest and lats.',
        instructions: [
            'Lie across bench with shoulders supported',
            'Hold dumbbell overhead with straight arms',
            'Lower weight behind head in arc motion',
            'Return to starting position',
            'Keep slight bend in elbows throughout'
        ]
    },
    {
        name: 'Pullover (Machine)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['back', 'shoulders'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based version of pullover exercise.',
        instructions: [
            'Adjust seat to appropriate height',
            'Grasp handles with palms facing down',
            'Pull handles in arc motion toward hips',
            'Return to start position with control',
            'Keep back pressed against pad'
        ]
    },
    {
        name: 'Push Press',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['legs', 'core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Explosive overhead press using leg drive.',
        instructions: [
            'Hold barbell at shoulders',
            'Slight dip with knees',
            'Explosively drive bar overhead',
            'Lock out arms at top',
            'Return to shoulder position'
        ]
    },
    {
        name: 'Push Up',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Classic bodyweight exercise for upper body.',
        instructions: [
            'Start in plank position',
            'Lower body until chest near ground',
            'Push back up to start position',
            'Keep body straight throughout',
            'Maintain steady breathing'
        ]
    },
    {
        name: 'Push Up (Band)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'Push-up variation with added band resistance.',
        instructions: [
            'Loop band across upper back',
            'Hold ends in hands in push-up position',
            'Perform push-up against band resistance',
            'Maintain straight body alignment',
            'Push back to start position'
        ]
    },
    {
        name: 'Push Up (Knees)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Modified push-up from knees for beginners.',
        instructions: [
            'Start on hands and knees',
            'Keep hands shoulder-width apart',
            'Lower chest toward ground',
            'Push back up to start',
            'Keep core engaged throughout'
        ]
    },
    {
        name: 'Rack Pull (Barbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['legs', 'core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Partial deadlift movement from elevated position.',
        instructions: [
            'Set barbell on rack at knee height',
            'Grip bar outside knees',
            'Keep back straight and chest up',
            'Pull bar up by extending hips and knees',
            'Return weight to rack with control'
        ]
    },
    {
        name: 'Oblique Crunch',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Core exercise targeting the oblique muscles.',
        instructions: [
            'Lie on back with knees bent',
            'Place hands behind head',
            'Lift shoulder blade rotating toward opposite knee',
            'Lower with control',
            'Alternate sides'
        ]
    },
    {
        name: 'Overhead Press (Barbell)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['arms', 'core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Standing shoulder press with barbell.',
        instructions: [
            'Hold barbell at shoulder level',
            'Press weight overhead',
            'Lock out arms at top',
            'Lower with control',
            'Keep core tight throughout'
        ]
    },
    {
        name: 'Overhead Press (Cable)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['arms', 'core'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Cable machine variation of overhead press.',
        instructions: [
            'Stand facing away from cable machine',
            'Press handles overhead',
            'Keep core engaged',
            'Lower with control',
            'Maintain stable base'
        ]
    },
    {
        name: 'Overhead Press (Dumbbell)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['arms', 'core'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Dumbbell variation of overhead press.',
        instructions: [
            'Hold dumbbells at shoulder level',
            'Press weights overhead',
            'Lock out arms at top',
            'Lower with control',
            'Keep core engaged throughout'
        ]
    },
    {
        name: 'Overhead Press (Smith Machine)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['arms', 'core'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Smith machine variation of overhead press.',
        instructions: [
            'Position bar at shoulder level',
            'Press bar overhead',
            'Lock out arms at top',
            'Lower with control',
            'Keep core engaged'
        ]
    },
    {
        name: 'Overhead Squat (Barbell)',
        primaryMuscles: ['olympic'],
        secondaryMuscles: ['legs', 'shoulders', 'core'],
        equipment: 'barbell',
        type: 'olympic',
        isPublic: true,
        description: 'Advanced squat variation with barbell held overhead.',
        instructions: [
            'Hold barbell overhead with wide grip',
            'Squat while keeping bar stable',
            'Maintain upright torso',
            'Keep arms locked throughout',
            'Return to standing position'
        ]
    },
    {
        name: 'Pec Deck (Machine)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based chest fly movement.',
        instructions: [
            'Sit with back against pad',
            'Grasp handles with arms out to sides',
            'Bring arms together in front',
            'Squeeze chest at peak contraction',
            'Return to start position with control'
        ]
    },
    {
        name: 'Pendlay Row (Barbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Explosive barbell row from floor.',
        instructions: [
            'Start with barbell on floor',
            'Bend at hips keeping back straight',
            'Pull bar to lower chest explosively',
            'Lower bar completely to floor',
            'Reset position for each rep'
        ]
    },
    {
        name: 'Pistol Squat',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Advanced single-leg squat movement.',
        instructions: [
            'Stand on one leg',
            'Extend other leg forward',
            'Squat down on standing leg',
            'Maintain balance throughout',
            'Return to standing position'
        ]
    },
    {
        name: 'Plank',
        primaryMuscles: ['core'],
        secondaryMuscles: ['shoulders'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Static core exercise holding push-up position.',
        instructions: [
            'Start in forearm plank position',
            'Keep body straight from head to heels',
            'Engage core muscles',
            'Hold position',
            'Maintain steady breathing'
        ]
    },
    {
        name: 'Power Clean',
        primaryMuscles: ['olympic'],
        secondaryMuscles: ['full body'],
        equipment: 'barbell',
        type: 'olympic',
        isPublic: true,
        description: 'Explosive Olympic lift from floor to shoulders.',
        instructions: [
            'Start with bar over feet',
            'Explosively pull bar from floor',
            'Pull yourself under the bar',
            'Catch bar at shoulders',
            'Stand up with weight'
        ]
    },
    {
        name: 'Power Snatch (Barbell)',
        primaryMuscles: ['olympic'],
        secondaryMuscles: ['full body'],
        equipment: 'barbell',
        type: 'olympic',
        isPublic: true,
        description: 'Explosive Olympic lift from floor to overhead.',
        instructions: [
            'Start with bar over feet',
            'Pull bar explosively from floor',
            'Pull yourself under bar',
            'Catch bar overhead',
            'Stand up with weight'
        ]
    },
    {
        name: 'Preacher Curl (Barbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Biceps isolation exercise using preacher bench.',
        instructions: [
            'Rest arms on preacher bench pad',
            'Hold barbell with underhand grip',
            'Curl weight up to shoulders',
            'Lower with control',
            'Keep upper arms on pad throughout'
        ]
    },
    {
        name: 'Lateral Box Jump',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'other',
        type: 'plyometrics',
        isPublic: true,
        description: 'Explosive lateral jumping exercise using a box or platform.',
        instructions: [
            'Stand sideways to box',
            'Bend knees slightly',
            'Jump sideways onto box',
            'Land softly with both feet',
            'Step down and repeat'
        ]
    },
    {
        name: 'Lateral Raise (Band)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: [],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'Shoulder isolation exercise using resistance bands.',
        instructions: [
            'Stand on resistance band',
            'Hold handles at sides',
            'Raise arms out to sides',
            'Lift until parallel with ground',
            'Lower with control'
        ]
    },
    {
        name: 'Lateral Raise (Cable)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: [],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Cable machine variation of lateral raise.',
        instructions: [
            'Stand sideways to cable machine',
            'Hold handle at side',
            'Raise arm out to side',
            'Lift until parallel with ground',
            'Lower with control'
        ]
    },
    {
        name: 'Lateral Raise (Dumbbell)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Classic shoulder isolation exercise with dumbbells.',
        instructions: [
            'Stand with dumbbells at sides',
            'Keep slight bend in elbows',
            'Raise arms out to sides',
            'Lift until parallel with ground',
            'Lower with control'
        ]
    },
    {
        name: 'Lateral Raise (Machine)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based lateral raise for shoulders.',
        instructions: [
            'Sit or stand at machine',
            'Position arms in pads',
            'Raise arms out to sides',
            'Keep controlled movement',
            'Lower with control'
        ]
    },
    {
        name: 'Leg Extension (Machine)',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Isolation exercise for quadriceps.',
        instructions: [
            'Sit on machine with back against pad',
            'Hook feet under pad',
            'Extend legs fully',
            'Hold briefly at top',
            'Lower with control'
        ]
    },
    {
        name: 'Leg Press',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Compound leg exercise using leg press machine.',
        instructions: [
            'Sit in machine with feet on platform',
            'Lower weight by bending knees',
            'Press weight up with legs',
            'Dont lock knees at top',
            'Keep back against pad'
        ]
    },
    {
        name: 'Lunge (Barbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Walking or stationary lunge with barbell.',
        instructions: [
            'Hold barbell across upper back',
            'Step forward into lunge position',
            'Lower back knee toward ground',
            'Push back to starting position',
            'Alternate legs'
        ]
    },
    {
        name: 'Lunge (Bodyweight)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Basic lunge movement using bodyweight.',
        instructions: [
            'Stand with feet together',
            'Step forward with one leg',
            'Lower back knee toward ground',
            'Push back to starting position',
            'Alternate legs'
        ]
    },
    {
        name: 'Lunge (Dumbbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Lunge variation holding dumbbells.',
        instructions: [
            'Hold dumbbells at sides',
            'Step forward into lunge',
            'Lower back knee toward ground',
            'Push back to start position',
            'Alternate legs'
        ]
    },
    {
        name: 'Lying Leg Curl (Machine)',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Isolation exercise for hamstrings.',
        instructions: [
            'Lie face down on machine',
            'Hook ankles under pad',
            'Curl weight up toward buttocks',
            'Hold briefly at top',
            'Lower with control'
        ]
    },
    {
        name: 'Mountain Climber',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core', 'cardio'],
        equipment: 'bodyweight',
        type: 'cardio',
        isPublic: true,
        description: 'Dynamic exercise combining core stability and leg movement.',
        instructions: [
            'Start in push-up position',
            'Bring one knee toward chest',
            'Quickly alternate legs',
            'Keep hips low',
            'Maintain rapid pace'
        ]
    },
    {
        name: 'Muscle Up',
        primaryMuscles: ['full body'],
        secondaryMuscles: ['back', 'chest', 'shoulders'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Advanced pull-up variation transitioning to dip position.',
        instructions: [
            'Hang from pull-up bar',
            'Pull explosively upward',
            'Drive hips to bar',
            'Transition to support position',
            'Lower with control'
        ]
    },
    {
        name: 'Jumping Jack',
        primaryMuscles: ['full body'],
        secondaryMuscles: ['cardio'],
        equipment: 'bodyweight',
        type: 'cardio',
        isPublic: true,
        description: 'Classic full body cardio exercise.',
        instructions: [
            'Start with feet together, arms at sides',
            'Jump feet out while raising arms overhead',
            'Jump feet back together lowering arms',
            'Maintain steady rhythm',
            'Keep core engaged throughout'
        ]
    },
    {
        name: 'Kettlebell Swing',
        primaryMuscles: ['full body'],
        secondaryMuscles: ['back', 'legs', 'shoulders'],
        equipment: 'kettlebell',
        type: 'strength',
        isPublic: true,
        description: 'Dynamic exercise using hip hinge movement.',
        instructions: [
            'Stand with feet shoulder-width apart',
            'Hinge at hips to swing kettlebell between legs',
            'Thrust hips forward to swing weight up',
            'Keep arms straight throughout',
            'Control the descent'
        ]
    },
    {
        name: 'Kettlebell Turkish Get Up',
        primaryMuscles: ['full body'],
        secondaryMuscles: ['core', 'shoulders'],
        equipment: 'kettlebell',
        type: 'strength',
        isPublic: true,
        description: 'Complex movement from floor to standing position.',
        instructions: [
            'Lie on back holding kettlebell overhead',
            'Roll to elbow while keeping weight stable',
            'Push to hand, then lunge position',
            'Stand up maintaining overhead position',
            'Reverse movement to return to floor'
        ]
    },
    {
        name: 'Kipping Pull Up',
        primaryMuscles: ['back'],
        secondaryMuscles: ['shoulders', 'core'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Dynamic pull-up using hip drive.',
        instructions: [
            'Hang from pull-up bar',
            'Generate swing with legs and hips',
            'Pull chest to bar at peak of swing',
            'Return to hanging position',
            'Maintain rhythm throughout'
        ]
    },
    {
        name: 'Knee Raise (Captain\'s Chair)',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Core exercise performed on captain\'s chair.',
        instructions: [
            'Support body on captain\'s chair',
            'Keep back against pad',
            'Raise knees toward chest',
            'Lower with control',
            'Maintain steady breathing'
        ]
    },
    {
        name: 'Kneeling Pulldown (Band)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms'],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'Kneeling lat pulldown using resistance band.',
        instructions: [
            'Kneel under secured resistance band',
            'Grasp band with overhand grip',
            'Pull band down to upper chest',
            'Control return to start position',
            'Keep core engaged throughout'
        ]
    },
    {
        name: 'Knees to Elbows',
        primaryMuscles: ['core'],
        secondaryMuscles: ['arms'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Advanced core exercise performed hanging from bar.',
        instructions: [
            'Hang from pull-up bar',
            'Raise knees to touch elbows',
            'Lower with control',
            'Keep shoulders engaged',
            'Maintain steady rhythm'
        ]
    },
    {
        name: 'Lat Pulldown (Cable)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms', 'shoulders'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Upper body pulling exercise using cable machine.',
        instructions: [
            'Sit at lat pulldown machine',
            'Grasp bar with wide grip',
            'Pull bar to upper chest',
            'Squeeze shoulder blades together',
            'Control return to start position'
        ]
    },
    {
        name: 'Lat Pulldown (Machine)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms', 'shoulders'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based variation of lat pulldown.',
        instructions: [
            'Sit at machine with thighs secured',
            'Grasp handles with wide grip',
            'Pull down to upper chest',
            'Squeeze shoulder blades together',
            'Return to start with control'
        ]
    },
    {
        name: 'Lat Pulldown (Single Arm)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Unilateral lat pulldown exercise.',
        instructions: [
            'Sit at cable machine',
            'Grasp single handle overhead',
            'Pull handle to shoulder',
            'Control return',
            'Complete reps then switch sides'
        ]
    },
    {
        name: 'Lat Pulldown - Underhand (Barbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Underhand grip variation of lat pulldown.',
        instructions: [
            'Sit at pulldown machine',
            'Grip bar with hands shoulder-width',
            'Pull bar to upper chest',
            'Keep elbows close to body',
            'Control return'
        ]
    },
    {
        name: 'Lat Pulldown - Underhand (Cable)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Cable machine version of underhand lat pulldown.',
        instructions: [
            'Sit at cable machine',
            'Grip bar with underhand grip',
            'Pull bar to upper chest',
            'Keep elbows close to body',
            'Return to start with control'
        ]
    },
    {
        name: 'Lat Pulldown - Wide Grip (Cable)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms', 'shoulders'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Wide grip variation of lat pulldown.',
        instructions: [
            'Sit at cable machine',
            'Take wide overhand grip on bar',
            'Pull bar to upper chest',
            'Keep chest up throughout',
            'Control return to start position'
        ]
    },
    {
        name: 'Incline Bench Press (Smith Machine)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Smith machine version of incline bench press.',
        instructions: [
            'Lie on incline bench under Smith machine',
            'Unrack bar at shoulder level',
            'Lower bar to upper chest',
            'Press bar up until arms extended',
            'Control bar throughout movement'
        ]
    },
    {
        name: 'Incline Chest Fly (Dumbbell)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Chest fly performed on an incline bench.',
        instructions: [
            'Lie on incline bench holding dumbbells',
            'Start with arms extended above chest',
            'Lower weights in wide arc',
            'Keep slight bend in elbows',
            'Return to starting position'
        ]
    },
    {
        name: 'Incline Chest Press (Machine)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based incline press movement.',
        instructions: [
            'Sit on machine with back on pad',
            'Grasp handles at shoulder level',
            'Press weight up until arms extended',
            'Lower with control',
            'Keep back against pad throughout'
        ]
    },
    {
        name: 'Incline Curl (Dumbbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Biceps curl performed on an incline bench.',
        instructions: [
            'Lie back on incline bench',
            'Hold dumbbells at sides',
            'Curl weights toward shoulders',
            'Lower with control',
            'Keep upper arms stationary'
        ]
    },
    {
        name: 'Incline Row (Dumbbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Back exercise performed on an incline bench.',
        instructions: [
            'Lie face down on incline bench',
            'Hold dumbbells hanging down',
            'Row weights to sides of chest',
            'Squeeze shoulder blades together',
            'Lower with control'
        ]
    },
    {
        name: 'Inverted Row (Bodyweight)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms', 'core'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Horizontal pulling exercise using body weight.',
        instructions: [
            'Position bar at appropriate height',
            'Hang under bar with straight body',
            'Pull chest to bar',
            'Keep core tight throughout',
            'Lower with control'
        ]
    },
    {
        name: 'Iso-Lateral Chest Press (Machine)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Independent arm chest press machine.',
        instructions: [
            'Sit with back against pad',
            'Grasp handles at chest level',
            'Press arms forward independently',
            'Return to start position',
            'Keep core engaged throughout'
        ]
    },
    {
        name: 'Iso-Lateral Row (Machine)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Independent arm rowing machine.',
        instructions: [
            'Sit facing machine with chest against pad',
            'Grasp handles with arms extended',
            'Pull handles back independently',
            'Squeeze shoulder blades',
            'Return to start position'
        ]
    },
    {
        name: 'Jackknife Sit Up',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Advanced sit-up variation targeting abs.',
        instructions: [
            'Lie on back with arms extended overhead',
            'Simultaneously raise legs and torso',
            'Reach for toes at peak of movement',
            'Lower back to start position',
            'Keep movements controlled'
        ]
    },
    {
        name: 'Judo',
        primaryMuscles: ['full body'],
        secondaryMuscles: ['cardio'],
        equipment: 'other',
        type: 'martial art',
        isPublic: true,
        description: 'Japanese martial art focusing on throws and grappling.',
        instructions: [
            'Practice with qualified instructor',
            'Learn proper falling techniques',
            'Master basic throws and holds',
            'Focus on balance and leverage',
            'Always train with partner'
        ]
    },
    {
        name: 'Jump Rope',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['legs'],
        equipment: 'other',
        type: 'cardio',
        isPublic: true,
        description: 'Classic cardio exercise using jump rope.',
        instructions: [
            'Hold rope handles at hip level',
            'Jump with both feet together',
            'Keep jumps small and controlled',
            'Land softly on balls of feet',
            'Maintain steady rhythm'
        ]
    },
    {
        name: 'Jump Shrug (Barbell)',
        primaryMuscles: ['olympic'],
        secondaryMuscles: ['shoulders', 'legs'],
        equipment: 'barbell',
        type: 'olympic',
        isPublic: true,
        description: 'Olympic lifting drill for clean technique.',
        instructions: [
            'Start with barbell at mid-thigh',
            'Jump explosively',
            'Shrug shoulders forcefully',
            'Land softly with bent knees',
            'Return to starting position'
        ]
    },
    {
        name: 'Jump Squat',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'bodyweight',
        type: 'plyometrics',
        isPublic: true,
        description: 'Explosive squat jump exercise.',
        instructions: [
            'Start in squat position',
            'Jump explosively upward',
            'Swing arms for momentum',
            'Land softly in squat position',
            'Immediately repeat movement'
        ]
    },
    {
        name: 'Hang Clean (Barbell)',
        primaryMuscles: ['olympic'],
        secondaryMuscles: ['full body'],
        equipment: 'barbell',
        type: 'olympic',
        isPublic: true,
        description: 'Olympic lift starting from hanging position.',
        instructions: [
            'Hold bar at hip level',
            'Explosively pull bar upward',
            'Pull body under bar',
            'Catch in front rack position',
            'Stand up with weight'
        ]
    },
    {
        name: 'Hang Snatch (Barbell)',
        primaryMuscles: ['olympic'],
        secondaryMuscles: ['full body'],
        equipment: 'barbell',
        type: 'olympic',
        isPublic: true,
        description: 'Olympic lift from hang position to overhead.',
        instructions: [
            'Start with bar at hip level',
            'Explosively pull bar upward',
            'Pull under bar quickly',
            'Catch bar overhead in squat',
            'Stand up with weight'
        ]
    },
    {
        name: 'Hanging Knee Raise',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Core exercise performed hanging from bar.',
        instructions: [
            'Hang from pull-up bar',
            'Keep body still',
            'Raise knees toward chest',
            'Lower with control',
            'Maintain steady breathing'
        ]
    },
    {
        name: 'Hanging Leg Raise',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Advanced core exercise with straight legs.',
        instructions: [
            'Hang from pull-up bar',
            'Keep legs straight',
            'Raise legs to horizontal',
            'Lower with control',
            'Avoid swinging'
        ]
    },
    {
        name: 'High Knee Skips',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['cardio'],
        equipment: 'bodyweight',
        type: 'cardio',
        isPublic: true,
        description: 'Dynamic running drill with high knees.',
        instructions: [
            'Skip forward bringing knees high',
            'Drive arms in running motion',
            'Land on balls of feet',
            'Maintain upright posture',
            'Keep movements controlled'
        ]
    },
    {
        name: 'Hiking',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['legs'],
        equipment: 'other',
        type: 'cardio',
        isPublic: true,
        description: 'Outdoor walking activity on trails or hills.',
        instructions: [
            'Wear appropriate footwear',
            'Maintain steady pace',
            'Use hiking poles if needed',
            'Stay hydrated',
            'Follow marked trails'
        ]
    },
    {
        name: 'Hip Abductor (Machine)',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine exercise targeting outer thigh muscles.',
        instructions: [
            'Sit in machine with legs in pads',
            'Push legs apart against resistance',
            'Control return movement',
            'Keep back against seat',
            'Maintain steady breathing'
        ]
    },
    {
        name: 'Hip Adductor (Machine)',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine exercise targeting inner thigh muscles.',
        instructions: [
            'Sit in machine with legs spread',
            'Squeeze legs together',
            'Control return movement',
            'Keep back against seat',
            'Maintain steady breathing'
        ]
    },
    {
        name: 'Hip Thrust (Barbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Glute-focused exercise using barbell.',
        instructions: [
            'Sit with upper back against bench',
            'Place barbell across hips',
            'Drive hips upward',
            'Squeeze glutes at top',
            'Lower with control'
        ]
    },
    {
        name: 'Hip Thrust (Bodyweight)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Basic hip thrust without weight.',
        instructions: [
            'Sit with upper back against bench',
            'Feet flat on ground',
            'Drive hips upward',
            'Squeeze glutes at top',
            'Lower with control'
        ]
    },
    {
        name: 'Incline Bench Press (Barbell)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Upper chest focused pressing movement.',
        instructions: [
            'Lie on incline bench',
            'Grip bar slightly wider than shoulders',
            'Lower bar to upper chest',
            'Press bar up until arms extended',
            'Keep core tight throughout'
        ]
    },
    {
        name: 'Incline Bench Press (Cable)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Cable version of incline press.',
        instructions: [
            'Set up bench between cable stations',
            'Grip handles at shoulder level',
            'Press up and in toward midline',
            'Lower with control',
            'Keep back against bench'
        ]
    },
    {
        name: 'Incline Bench Press (Dumbbell)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Dumbbell version of incline press.',
        instructions: [
            'Lie on incline bench',
            'Hold dumbbells at shoulder level',
            'Press weights up until arms extended',
            'Lower with control',
            'Keep back against bench'
        ]
    },
    {
        name: 'Front Raise (Dumbbell)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Shoulder isolation exercise using dumbbells.',
        instructions: [
            'Stand holding dumbbells in front of thighs',
            'Keep slight bend in elbows',
            'Raise weights to shoulder height',
            'Lower with control',
            'Maintain good posture throughout'
        ]
    },
    {
        name: 'Front Raise (Plate)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: [],
        equipment: 'other',
        type: 'strength',
        isPublic: true,
        description: 'Shoulder exercise using weight plate.',
        instructions: [
            'Hold plate with both hands at thighs',
            'Keep arms slightly bent',
            'Raise plate to shoulder height',
            'Lower with control',
            'Maintain straight back'
        ]
    },
    {
        name: 'Front Squat (Barbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Squat variation with barbell in front rack position.',
        instructions: [
            'Hold bar in front rack position',
            'Keep elbows high',
            'Squat down maintaining upright torso',
            'Drive through heels to stand',
            'Maintain core tension throughout'
        ]
    },
    {
        name: 'Glute Ham Raise',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Posterior chain exercise using GHD machine.',
        instructions: [
            'Position body on GHD machine',
            'Keep torso straight',
            'Lower body toward ground',
            'Raise body back up',
            'Focus on hamstring and glute contraction'
        ]
    },
    {
        name: 'Glute Kickback (Machine)',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based glute isolation exercise.',
        instructions: [
            'Position leg on pad',
            'Grip handles for support',
            'Kick leg back and up',
            'Squeeze glute at top',
            'Return to start position'
        ]
    },
    {
        name: 'Goblet Squat (Kettlebell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'kettlebell',
        type: 'strength',
        isPublic: true,
        description: 'Squat holding kettlebell at chest.',
        instructions: [
            'Hold kettlebell at chest height',
            'Keep elbows pointed down',
            'Squat while keeping torso upright',
            'Push through heels to stand',
            'Keep core engaged throughout'
        ]
    },
    {
        name: 'Good Morning (Barbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['legs'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Hip hinge movement targeting lower back and hamstrings.',
        instructions: [
            'Place bar across upper back',
            'Bend at hips keeping back straight',
            'Lower torso toward ground',
            'Return to upright position',
            'Keep slight bend in knees'
        ]
    },
    {
        name: 'Hack Squat',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based squat variation.',
        instructions: [
            'Position shoulders under pads',
            'Place feet shoulder width',
            'Lower body by bending knees',
            'Push through feet to return up',
            'Keep back against pad'
        ]
    },
    {
        name: 'Hack Squat (Barbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Barbell squat performed with weight behind body.',
        instructions: [
            'Hold barbell behind legs',
            'Feet shoulder width apart',
            'Squat down keeping torso upright',
            'Drive through heels to stand',
            'Keep core engaged throughout'
        ]
    },
    {
        name: 'Hammer Curl (Band)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'Neutral grip curl using resistance band.',
        instructions: [
            'Stand on resistance band',
            'Grip handles with palms facing each other',
            'Curl band up toward shoulders',
            'Keep elbows at sides',
            'Lower with control'
        ]
    },
    {
        name: 'Hammer Curl (Cable)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Cable machine version of hammer curl.',
        instructions: [
            'Attach rope handle to low pulley',
            'Grip ends with palms facing each other',
            'Curl rope toward shoulders',
            'Keep elbows at sides',
            'Lower with control'
        ]
    },
    {
        name: 'Hammer Curl (Dumbbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Biceps curl with neutral grip.',
        instructions: [
            'Hold dumbbells at sides',
            'Palms facing each other',
            'Curl weights toward shoulders',
            'Keep elbows at sides',
            'Lower with control'
        ]
    },
    {
        name: 'Handstand Push Up',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['shoulders', 'core'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Advanced push-up variation in handstand position.',
        instructions: [
            'Kick up into handstand against wall',
            'Lower body by bending arms',
            'Push back up to start',
            'Maintain tight core',
            'Keep body aligned throughout'
        ]
    },
    {
        name: 'Flat Leg Raise',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Core exercise performed lying on back.',
        instructions: [
            'Lie on back with legs straight',
            'Keep lower back pressed to floor',
            'Raise legs to vertical position',
            'Lower legs with control',
            'Maintain steady breathing'
        ]
    },
    {
        name: 'Floor Press (Barbell)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Bench press variation performed on floor.',
        instructions: [
            'Lie on floor with knees bent',
            'Hold barbell above chest',
            'Lower until upper arms touch floor',
            'Press bar back up',
            'Keep core tight throughout'
        ]
    },
    {
        name: 'Front Raise (Band)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: [],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'Shoulder raise using resistance band.',
        instructions: [
            'Stand on band holding ends',
            'Keep slight bend in elbows',
            'Raise arms forward to shoulder height',
            'Lower with control',
            'Maintain good posture'
        ]
    },
    {
        name: 'Front Raise (Barbell)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: [],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Shoulder raise using barbell.',
        instructions: [
            'Hold barbell in front of thighs',
            'Keep slight bend in elbows',
            'Raise bar to shoulder height',
            'Lower with control',
            'Maintain straight back'
        ]
    },
    {
        name: 'Front Raise (Cable)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: [],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Cable machine version of front raise.',
        instructions: [
            'Stand facing away from cable machine',
            'Grip handle with both hands',
            'Raise arms forward to shoulder height',
            'Lower with control',
            'Keep core engaged'
        ]
    },
    {
        name: 'Deadlift (Band)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['back', 'core'],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'Deadlift movement using resistance bands.',
        instructions: [
            'Stand on band with feet shoulder width',
            'Hinge at hips to grasp band',
            'Keep back straight',
            'Stand up with band',
            'Return to start position with control'
        ]
    },
    {
        name: 'Deadlift (Barbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['legs', 'core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Classic compound lift from floor.',
        instructions: [
            'Stand with feet shoulder width',
            'Bend at hips to grasp bar',
            'Keep back straight, chest up',
            'Pull bar up by extending hips and knees',
            'Return weight to floor with control'
        ]
    },
    {
        name: 'Deadlift (Dumbbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['back', 'core'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Deadlift variation using dumbbells.',
        instructions: [
            'Stand with dumbbells in front of thighs',
            'Hinge at hips, keeping back straight',
            'Lower weights toward floor',
            'Return to standing by extending hips',
            'Maintain neutral spine throughout'
        ]
    },
    {
        name: 'Deadlift (Smith Machine)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['back', 'core'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Smith machine version of deadlift.',
        instructions: [
            'Position bar at appropriate height',
            'Grasp bar with shoulder width grip',
            'Keep back straight, chest up',
            'Extend hips and knees to stand',
            'Return bar to start position'
        ]
    },
    {
        name: 'Deadlift High Pull (Barbell)',
        primaryMuscles: ['olympic'],
        secondaryMuscles: ['back', 'shoulders'],
        equipment: 'barbell',
        type: 'olympic',
        isPublic: true,
        description: 'Olympic lift variation ending in high pull.',
        instructions: [
            'Start in deadlift position',
            'Pull bar explosively',
            'As bar passes hips, pull high to chest',
            'Keep bar close to body',
            'Return to start position with control'
        ]
    },
    {
        name: 'Decline Bench Press (Barbell)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Lower chest focused pressing movement.',
        instructions: [
            'Lie on decline bench',
            'Unrack bar to chest level',
            'Lower bar to lower chest',
            'Press bar up until arms extended',
            'Keep feet hooked under pads'
        ]
    },
    {
        name: 'Decline Bench Press (Dumbbell)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Dumbbell version of decline press.',
        instructions: [
            'Lie on decline bench',
            'Hold dumbbells at chest level',
            'Press weights up until arms extended',
            'Lower weights with control',
            'Keep feet secured under pads'
        ]
    },
    {
        name: 'Decline Bench Press (Smith Machine)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Smith machine version of decline press.',
        instructions: [
            'Lie on decline bench under Smith machine',
            'Unrack bar to chest level',
            'Press bar up until arms extended',
            'Lower with control',
            'Keep feet secured'
        ]
    },
    {
        name: 'Decline Crunch',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Core exercise on decline bench.',
        instructions: [
            'Lie on decline bench',
            'Hook feet under pads',
            'Place hands behind head',
            'Curl torso up toward knees',
            'Lower with control'
        ]
    },
    {
        name: 'Deficit Deadlift (Barbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['back', 'core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Deadlift performed from elevated position.',
        instructions: [
            'Stand on platform with bar at feet',
            'Bend deeper to grasp bar',
            'Keep back straight, chest up',
            'Stand up with weight',
            'Return to start position with control'
        ]
    },
    {
        name: 'Elliptical Machine',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['legs'],
        equipment: 'machine',
        type: 'cardio',
        isPublic: true,
        description: 'Low-impact cardiovascular exercise machine.',
        instructions: [
            'Step onto machine and grab handles',
            'Start pedaling in smooth motion',
            'Keep upper body relatively still',
            'Maintain consistent pace',
            'Push and pull handles if equipped'
        ]
    },
    {
        name: 'Face Pull (Cable)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['back'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Rear delt and upper back exercise.',
        instructions: [
            'Attach rope to high pulley',
            'Pull rope toward face',
            'Keep elbows high',
            'Squeeze shoulder blades together',
            'Return to start position with control'
        ]
    },
    {
        name: 'Chest Press (Band)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'Chest press using resistance bands.',
        instructions: [
            'Wrap band around sturdy object at chest height',
            'Face away from anchor point',
            'Press bands forward',
            'Control return movement',
            'Keep core engaged throughout'
        ]
    },
    {
        name: 'Chest Press (Machine)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based chest press movement.',
        instructions: [
            'Adjust seat to appropriate height',
            'Grasp handles at chest level',
            'Press weight forward',
            'Control return movement',
            'Keep back against pad'
        ]
    },
    {
        name: 'Chin Up',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms', 'core'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Upper body pull using underhand grip.',
        instructions: [
            'Hang from bar with underhand grip',
            'Pull body up until chin over bar',
            'Lower with control',
            'Keep core engaged',
            'Maintain steady breathing'
        ]
    },
    {
        name: 'Chin Up (Assisted)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms', 'core'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-assisted chin up movement.',
        instructions: [
            'Adjust weight to appropriate level',
            'Grip handles with underhand grip',
            'Pull up until chin over bar',
            'Lower with control',
            'Keep core engaged'
        ]
    },
    {
        name: 'Clean (Barbell)',
        primaryMuscles: ['olympic'],
        secondaryMuscles: ['full body'],
        equipment: 'barbell',
        type: 'olympic',
        isPublic: true,
        description: 'Olympic lift from floor to shoulders.',
        instructions: [
            'Start with bar over feet',
            'Pull bar explosively from floor',
            'Pull yourself under bar',
            'Catch in front rack position',
            'Stand up with weight'
        ]
    },
    {
        name: 'Clean and Jerk (Barbell)',
        primaryMuscles: ['olympic'],
        secondaryMuscles: ['full body'],
        equipment: 'barbell',
        type: 'olympic',
        isPublic: true,
        description: 'Full Olympic lift from floor to overhead.',
        instructions: [
            'Clean bar to shoulders',
            'Dip slightly at knees',
            'Drive bar overhead',
            'Split legs or squat under bar',
            'Stand with weight overhead'
        ]
    },
    {
        name: 'Climbing',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['full body'],
        equipment: 'other',
        type: 'cardio',
        isPublic: true,
        description: 'Vertical climbing activity.',
        instructions: [
            'Use appropriate safety equipment',
            'Plan route before climbing',
            'Maintain three points of contact',
            'Use legs more than arms',
            'Climb within ability level'
        ]
    },
    {
        name: 'Concentration Curl (Dumbbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Isolated bicep curl performed seated.',
        instructions: [
            'Sit on bench with elbow on inner thigh',
            'Hold dumbbell hanging down',
            'Curl weight toward shoulder',
            'Lower with control',
            'Keep upper arm stationary'
        ]
    },
    {
        name: 'Cross Body Crunch',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Oblique-focused crunch variation.',
        instructions: [
            'Lie on back with knees bent',
            'Place hands behind head',
            'Lift shoulder toward opposite knee',
            'Return to start position',
            'Alternate sides'
        ]
    },
    {
        name: 'Crunch',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Basic abdominal crunch movement.',
        instructions: [
            'Lie on back with knees bent',
            'Place hands behind head',
            'Lift shoulders off ground',
            'Lower with control',
            'Keep lower back pressed to floor'
        ]
    },
    {
        name: 'Crunch (Machine)',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based crunch movement.',
        instructions: [
            'Sit in machine with back against pad',
            'Grasp handles',
            'Curl torso forward',
            'Return with control',
            'Keep movement controlled'
        ]
    },
    {
        name: 'Crunch (Stability Ball)',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'other',
        type: 'strength',
        isPublic: true,
        description: 'Crunch performed on stability ball.',
        instructions: [
            'Position lower back on ball',
            'Place hands behind head',
            'Curl torso up',
            'Lower with control',
            'Keep ball stable throughout'
        ]
    },
    {
        name: 'Cycling',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['legs'],
        equipment: 'other',
        type: 'cardio',
        isPublic: true,
        description: 'Outdoor cycling activity.',
        instructions: [
            'Adjust bike to proper height',
            'Maintain steady cadence',
            'Keep proper posture',
            'Stay aware of surroundings',
            'Wear appropriate safety gear'
        ]
    },
    {
        name: 'Cycling (Indoor)',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['legs'],
        equipment: 'machine',
        type: 'cardio',
        isPublic: true,
        description: 'Stationary bike cardio exercise.',
        instructions: [
            'Adjust seat and handlebar height',
            'Start pedaling at steady pace',
            'Maintain proper form',
            'Adjust resistance as needed',
            'Keep core engaged'
        ]
    },
    {
        name: 'Bulgarian Split Squat',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Single leg squat with rear foot elevated.',
        instructions: [
            'Place rear foot on bench',
            'Stand on front leg',
            'Lower into split squat',
            'Push through front foot to stand',
            'Keep torso upright throughout'
        ]
    },
    {
        name: 'Burpee',
        primaryMuscles: ['full body'],
        secondaryMuscles: ['cardio'],
        equipment: 'bodyweight',
        type: 'cardio',
        isPublic: true,
        description: 'Full body conditioning exercise.',
        instructions: [
            'Drop to squat position',
            'Kick feet back to plank',
            'Perform push-up',
            'Jump feet back to squat',
            'Jump up explosively'
        ]
    },
    {
        name: 'Cable Crossover',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Chest isolation exercise using cables.',
        instructions: [
            'Stand between cable machines',
            'Grasp high pulley handles',
            'Pull handles down and together',
            'Control return movement',
            'Keep slight bend in elbows'
        ]
    },
    {
        name: 'Cable Crunch',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Kneeling cable ab exercise.',
        instructions: [
            'Kneel facing low pulley',
            'Hold rope behind head',
            'Crunch torso down',
            'Return with control',
            'Keep hips stationary'
        ]
    },
    {
        name: 'Cable Kickback',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Triceps isolation using cable.',
        instructions: [
            'Face cable machine',
            'Bend forward at hips',
            'Keep upper arm still',
            'Extend forearm back',
            'Control return movement'
        ]
    },
    {
        name: 'Cable Pull Through',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core', 'back'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Hip hinge movement using cable.',
        instructions: [
            'Stand facing away from cable',
            'Bend at hips',
            'Pull cable through legs',
            'Stand up straight',
            'Squeeze glutes at top'
        ]
    },
    {
        name: 'Cable Twist',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Rotational core exercise.',
        instructions: [
            'Stand sideways to cable',
            'Grasp handle at chest height',
            'Rotate away from machine',
            'Control return movement',
            'Keep hips stable'
        ]
    },
    {
        name: 'Calf Press on Leg Press',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Calf raise on leg press machine.',
        instructions: [
            'Position feet on platform',
            'Extend legs',
            'Lower heels below platform',
            'Push through balls of feet',
            'Hold peak contraction'
        ]
    },
    {
        name: 'Calf Press on Seated Leg Press',
        primaryMuscles: ['legs'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Seated variation of calf press.',
        instructions: [
            'Sit in machine with feet on platform',
            'Position toes on edge',
            'Press through balls of feet',
            'Lower heels with control',
            'Keep legs slightly bent'
        ]
    },
    {
        name: 'Chest Dip',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Bodyweight chest exercise on parallel bars.',
        instructions: [
            'Grip parallel bars',
            'Lean forward slightly',
            'Lower body with control',
            'Press back to start',
            'Keep elbows close to body'
        ]
    },
    {
        name: 'Chest Dip (Assisted)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-assisted chest dip.',
        instructions: [
            'Adjust weight assistance',
            'Grip handles and lean forward',
            'Lower body with control',
            'Press back to start',
            'Keep core engaged'
        ]
    },
    {
        name: 'Chest Fly',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based chest fly movement.',
        instructions: [
            'Sit with back against pad',
            'Grasp handles',
            'Press arms together',
            'Control return movement',
            'Keep slight bend in elbows'
        ]
    },
    {
        name: 'Chest Fly (Band)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders'],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'Resistance band chest fly.',
        instructions: [
            'Anchor band behind you',
            'Stand with arms out',
            'Bring hands together',
            'Control return movement',
            'Keep slight bend in elbows'
        ]
    },
    {
        name: 'Chest Fly (Dumbbell)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Dumbbell variation of chest fly.',
        instructions: [
            'Hold dumbbells at sides',
            'Perform chest fly with proper form',
            'Keep elbows close to body',
            'Return to start position'
        ]
    },
    {
        name: 'Bench Press - Close Grip (Barbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: ['chest', 'shoulders'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Triceps focused bench press variation.',
        instructions: [
            'Lie on bench with narrow grip',
            'Lower bar to lower chest',
            'Press bar up',
            'Keep elbows close to body',
            'Maintain wrist alignment'
        ]
    },
    {
        name: 'Bench Press - Wide Grip (Barbell)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Wide grip variation of bench press.',
        instructions: [
            'Grip bar wider than shoulders',
            'Lower bar to chest',
            'Press bar up',
            'Keep back on bench',
            'Control the movement'
        ]
    },
    {
        name: 'Bent Over One Arm Row (Dumbbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Single arm back exercise.',
        instructions: [
            'Bend over with hand on bench',
            'Hold dumbbell in free hand',
            'Pull weight to side',
            'Lower with control',
            'Keep back straight'
        ]
    },
    {
        name: 'Bent Over Row (Band)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms'],
        equipment: 'bands',
        type: 'strength',
        isPublic: true,
        description: 'Back exercise using resistance band.',
        instructions: [
            'Stand on band with feet',
            'Bend at hips',
            'Pull band to chest',
            'Control return',
            'Keep back straight'
        ]
    },
    {
        name: 'Bent Over Row (Barbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Compound back exercise.',
        instructions: [
            'Bend at hips',
            'Grasp bar with overhand grip',
            'Pull bar to lower chest',
            'Lower with control',
            'Keep back straight'
        ]
    },
    {
        name: 'Bent Over Row (Dumbbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Back exercise using dumbbells.',
        instructions: [
            'Bend at hips',
            'Hold dumbbells hanging down',
            'Pull weights to sides',
            'Lower with control',
            'Keep back straight'
        ]
    },
    {
        name: 'Bent Over Row - Underhand (Barbell)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['arms'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Underhand grip variation of bent over row.',
        instructions: [
            'Bend at hips',
            'Grip bar with hands under',
            'Pull bar to abdomen',
            'Lower with control',
            'Keep back straight'
        ]
    },
    {
        name: 'Bicep Curl (Barbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Basic bicep exercise with barbell.',
        instructions: [
            'Stand holding barbell',
            'Curl weight up',
            'Keep elbows at sides',
            'Lower with control',
            'Maintain good posture'
        ]
    },
    {
        name: 'Bicep Curl (Cable)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Cable machine bicep curl.',
        instructions: [
            'Stand facing low pulley',
            'Curl bar up',
            'Keep elbows at sides',
            'Lower with control',
            'Maintain posture'
        ]
    },
    {
        name: 'Bicep Curl (Dumbbell)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Basic bicep curl with dumbbells.',
        instructions: [
            'Stand holding dumbbells',
            'Curl weights up',
            'Keep elbows at sides',
            'Lower with control',
            'Alternate arms if desired'
        ]
    },
    {
        name: 'Bicep Curl (Machine)',
        primaryMuscles: ['arms'],
        secondaryMuscles: [],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based bicep curl.',
        instructions: [
            'Adjust seat height',
            'Grip handles',
            'Curl weight up',
            'Lower with control',
            'Keep back against pad'
        ]
    },
    {
        name: 'Bicycle Crunch',
        primaryMuscles: ['core'],
        secondaryMuscles: [],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Dynamic core exercise.',
        instructions: [
            'Lie on back',
            'Lift shoulders off ground',
            'Alternate elbow to opposite knee',
            'Extend other leg',
            'Keep lower back pressed down'
        ]
    },
    {
        name: 'Box Jump',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'other',
        type: 'plyometrics',
        isPublic: true,
        description: 'Explosive jumping exercise.',
        instructions: [
            'Stand facing box',
            'Bend knees slightly',
            'Jump onto box',
            'Land softly',
            'Step down and repeat'
        ]
    },
    {
        name: 'Box Squat (Barbell)',
        primaryMuscles: ['legs'],
        secondaryMuscles: ['core'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Squat variation using box.',
        instructions: [
            'Position box behind you',
            'Squat back to box',
            'Touch box lightly',
            'Drive up through heels',
            'Keep chest up throughout'
        ]
    },
    {
        name: 'Ab Wheel',
        primaryMuscles: ['core'],
        secondaryMuscles: ['shoulders'],
        equipment: 'other',
        type: 'strength',
        isPublic: true,
        description: 'Core exercise using ab wheel.',
        instructions: [
            'Kneel on floor holding wheel',
            'Roll wheel forward',
            'Keep core tight',
            'Pull back to start',
            'Maintain straight back'
        ]
    },
    {
        name: 'Aerobics',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['full body'],
        equipment: 'bodyweight',
        type: 'cardio',
        isPublic: true,
        description: 'Rhythmic aerobic exercise.',
        instructions: [
            'Follow instructor or routine',
            'Keep moving continuously',
            'Maintain proper form',
            'Stay at comfortable pace',
            'Stay hydrated'
        ]
    },
    {
        name: 'Arnold Press (Dumbbell)',
        primaryMuscles: ['shoulders'],
        secondaryMuscles: ['arms'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Complex shoulder press variation.',
        instructions: [
            'Start with palms facing body',
            'Press weights while rotating',
            'End with palms facing forward',
            'Lower with reverse rotation',
            'Keep core engaged'
        ]
    },
    {
        name: 'Around the World',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Dynamic chest and shoulder movement.',
        instructions: [
            'Hold dumbbell in one hand',
            'Move weight in circular motion',
            'Keep arm straight',
            'Maintain control throughout',
            'Switch directions'
        ]
    },
    {
        name: 'Back Extension',
        primaryMuscles: ['back'],
        secondaryMuscles: ['core'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Lower back strengthening exercise.',
        instructions: [
            'Lie face down on floor',
            'Place hands behind head',
            'Lift chest off ground',
            'Lower with control',
            'Keep legs on ground'
        ]
    },
    {
        name: 'Back Extension (Machine)',
        primaryMuscles: ['back'],
        secondaryMuscles: ['core'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Machine-based back extension.',
        instructions: [
            'Position in machine',
            'Secure legs',
            'Bend forward',
            'Extend back up',
            'Control movement'
        ]
    },
    {
        name: 'Ball Slams',
        primaryMuscles: ['full body'],
        secondaryMuscles: ['core'],
        equipment: 'other',
        type: 'strength',
        isPublic: true,
        description: 'Explosive exercise with medicine ball.',
        instructions: [
            'Hold ball overhead',
            'Slam ball to ground',
            'Catch on bounce',
            'Repeat explosively',
            'Keep core tight'
        ]
    },
    {
        name: 'Battle Ropes',
        primaryMuscles: ['cardio'],
        secondaryMuscles: ['arms', 'shoulders'],
        equipment: 'other',
        type: 'cardio',
        isPublic: true,
        description: 'High-intensity rope exercise.',
        instructions: [
            'Hold rope ends',
            'Create wave patterns',
            'Alternate arms',
            'Keep moving continuously',
            'Maintain good form'
        ]
    },
    {
        name: 'Bench Dip',
        primaryMuscles: ['arms'],
        secondaryMuscles: ['chest', 'shoulders'],
        equipment: 'bodyweight',
        type: 'strength',
        isPublic: true,
        description: 'Triceps exercise using bench.',
        instructions: [
            'Position hands on bench edge',
            'Extend legs out',
            'Lower body with control',
            'Push back up',
            'Keep elbows close to body'
        ]
    },
    {
        name: 'Bench Press (Barbell)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'barbell',
        type: 'strength',
        isPublic: true,
        description: 'Classic chest pressing exercise.',
        instructions: [
            'Lie on bench',
            'Grip bar shoulder width',
            'Lower to chest',
            'Press up to start',
            'Keep feet planted'
        ]
    },
    {
        name: 'Bench Press (Cable)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'cables',
        type: 'strength',
        isPublic: true,
        description: 'Cable version of bench press.',
        instructions: [
            'Lie on bench between cables',
            'Press handles up',
            'Lower with control',
            'Keep back on bench',
            'Maintain tension'
        ]
    },
    {
        name: 'Bench Press (Dumbbell)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'dumbbell',
        type: 'strength',
        isPublic: true,
        description: 'Dumbbell version of bench press.',
        instructions: [
            'Lie on bench',
            'Hold dumbbells at chest level',
            'Press weights up',
            'Lower with control',
            'Keep wrists straight'
        ]
    },
    {
        name: 'Bench Press (Smith Machine)',
        primaryMuscles: ['chest'],
        secondaryMuscles: ['shoulders', 'arms'],
        equipment: 'machine',
        type: 'strength',
        isPublic: true,
        description: 'Smith machine version of bench press.',
        instructions: [
            'Lie on bench under bar',
            'Unrack weight',
            'Lower to chest',
            'Press up',
            'Follow fixed bar path'
        ]
    }
];

async function seedExercises() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('Please add your Mongo URI to .env');  // Changed from .env.local
    }

    const client = await MongoClient.connect(uri);
    const db = client.db();

    try {
        // Clear existing exercises
        await db.collection('exercises').deleteMany({});
        
        // Insert new exercises
        const result = await db.collection('exercises').insertMany(exercises);
        console.log(`Successfully seeded ${result.insertedCount} exercises`);
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.close();
    }
}

seedExercises();