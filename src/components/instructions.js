const instructions = {
  login: {
    title: "Welcome!",
    content: `Thank you for participating in this survey!
     It will only take 5minutes. Please create a username to continue`,
  },
  search: {
    text: {
      title: "Instructions",
      content: `For the first phase,
       please search for the item in the search bar below and purchase the most appropriate product.
       If no items are found click the 'not found' button at the top left of the screen`,
    },
    voice: {
      title: "Instructions",
      content: `For the second phase,
      please search for the item below using your voice by tapping on the microphone icon,
      tap again to stop recording`,
    },
    image: {
      title: "Instructions",
      content: `For the third Phase,
      Please search for the item below by tapping the camera icon and taking a picture or by uploading an image`,
    },
  },
  purchase: {
    title: "Confirm purchase ?",
    content: "",
    primaryButton: "confirm",
    secondaryButton: "cancel",
  },
  accuracy: {
    title: "Instructions",
    content: `For the second half,
    Please select all search result that were relevant, ie results that were very close to what you searched for.
    Select the 'Done' button at the top left of the screen to finish the current phase`,
  },
  notFound: {
    title: "Item not Found ?",
    content: "You can try searching using other words or images",
    primaryButton: "Not found",
    secondaryButton: "try again",
  },
  survey: [
    {
      question:"How are you most likely to search for products ",
      options:['Text','Voice','Image']
    },
    {
      question: "How often do you perform text searches on any devices ", // line graph for trend. may need to change this to input field
      options: ['never','1-5 times a week','6-10 times a week'],
    },
    {
      question: "How often do you perform voice searches on any devices ",
      options: ['never','1-5 times a week','6-10 times a week'],
    },
    {
      question: "How often do you perform image searches on any devices ",
      options: ['never','1-5 times a week','6-10 times a week'],
    },
    { 
      question: "What device do you perform text searches on ", // use pie chart to represent this
      options: ['Mobile','Laptop','smart speaker'],
    },
    {
      question: "What device do you perform voice searches on ",
      options: ['Mobile','Laptop','smart speaker'],
    },
    {
      question: "What device do you perform image searches on ",
      options: ['Mobile','Laptop','smart speaker'],
    },
    {
      question:"How often does text search completely fail you ", //7
      options:['never','rarely','sometimes','all the times']
    },
    {
      question:"How often does voice search misunderstand you ",
      options:['never','rarely','sometimes','all the times']
    },
    {
      question:"How often does image search fail you ",
      options:['never','rarely','sometimes','all the times']
    },
    {
      question:"How stressful is it to use text search ", // use bar charts for this
      options:['very stressful','stressful','neutral','pleasant to use']
    },
    {
      question:"How stressful is it to use voice search ",
      options:['very stressful','stressful','neutral','pleasant to use']
    },
    {
      question:"How stressful is it to use image search ",
      options:['very stressful','stressful','neutral','pleasant to use']  
    },
    {
      question:"which of these search methods do you look forward to using ",
      options:['text','image','voice']
    },
  ],
};

export default instructions;
