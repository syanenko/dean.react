//
// TODO
//
// 1. Layout
// 2. Resize images
// 3. Dialog jumps +
// 4. Fetch sides changes +
// 5. Dialog transition (?) -
// 6. Paper color (yellow) +
// 7. Put to GitHub
// 8. Three scene display template
// 9. Google analytics

import React          from 'react';
import ReactDOM       from 'react-dom';

import { makeStyles } from '@material-ui/core/styles';
import Paper          from '@material-ui/core/Paper';
import Grid           from '@material-ui/core/Grid';
import ButtonBase     from '@material-ui/core/ButtonBase';
import Dialog         from '@material-ui/core/Dialog';
import DialogContent  from '@material-ui/core/DialogContent';
import Typography     from '@material-ui/core/Typography';
import Box            from '@material-ui/core/Box';
import IconButton     from '@material-ui/core/IconButton';
import Link           from '@material-ui/core/Link';
import InfoOutlined   from '@material-ui/icons/InfoOutlined';

import PlayCircleOutlineOutlinedIcon from '@material-ui/icons/PlayCircleOutlineOutlined';

import AppBackground  from './data/images/AppBackground.jpg';
import FlightsImage   from './data/images/Flights.png';
import FlightsInfo    from './data/images/FlightsInfo.png';
import IslandsImage   from './data/images/Islands.jpg';
import IslandsInfo    from './data/images/IslandsInfo.png';
import ParrotImage    from './data/images/Parrot.png';
import ParrotInfo     from './data/images/ParrotInfo.png';
import FetchImage     from './data/images/Fetch.jpg';
import FetchInfo      from './data/images/FetchInfo.png';
import BridgeImage    from './data/images/Bridge.png';
import BridgeInfo     from './data/images/BridgeInfo.png';
import TFTOImage      from './data/images/TFTO.jpg';
import TFTOInfo       from './data/images/TFTOInfo.jpg';
import BirdImage      from './data/images/Bird.png';
import LogoImage      from './data/images/Logo.png';

import './App.css';
import { sceneTFTO } from './scenes/sceneTFTO';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: `url(${AppBackground})`,
    height: '1440px'
  },
  
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    background: '#FEE9D4'
  },
  
  dialogPaper: {
        minHeight: '30vh',
        maxHeight: '100vh',
        background: '#FEE9D4'
  },
  
  painting: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  
  title: {
    textAlign: 'center',
    height: '35px',
    color: theme.palette.text.secondary
  },

  flights: {
    width: '1193px',
    height: '856px',
    margin: 'auto',
    padding: theme.spacing(2),
    textAlign: 'center'
  },

  bridge: {
    width: '800px',
    height: '534px',
    margin: 'auto',
    padding: theme.spacing(2),
    textAlign: 'center'
  },

  fetch: {
    width: '1200px',
    height: '796px',
    margin: 'auto',
    padding: theme.spacing(2),
    textAlign: 'center'
  },

  islands: {
    width: '1024px',
    height: '624px',
    margin: 'auto',
    padding: theme.spacing(2),
    textAlign: 'center'
  },

  parrot: {
    width: '1196px',
    height: '820px',

    margin: 'auto',
    padding: theme.spacing(2),
    textAlign: 'center'
  },

  tfto: {
    width: '1200px',
    height: '750px',
    margin: 'auto',
    padding: theme.spacing(2),
    textAlign: 'center'
  },

}));

// Active globals
var activeAnimation;
var activeScene;
var activeAnimationTitle;
var activeStyle;
var activeInfo;

function App() {
  const classes = useStyles();

  // Paths
  const FLIGHTS_PATH = "./data/animations/flights/flights.json";
  const BRIDGE_PATH  = "./data/animations/bridge/bridge.json";
  const FETCH_PATH   = "./data/animations/fetch/fetch.json";
  const ISLANDS_PATH = "./data/animations/islands/islands.json";
  const PARROT_PATH  = "./data/animations/parrot/parrot.json";
  
  // Animation dialog
  const [openAnimation, setOpenAnimation] = React.useState(false);
  function handleOpenAnimation(animation, scene, info, style, title) {
    activeAnimation = animation;
    activeScene = scene;
    activeInfo = info;
    activeStyle = style;
    activeAnimationTitle = title;
    setOpenAnimation(true);
  }

  function handleCloseAnimation() {
    setOpenAnimation(false);
    setShowInfo(false);
  }

  function showAnimation() {
    window.UnityLoader.instantiate("animationContainer", activeAnimation, { onProgress: () => { } });
  }

  function showScene() {
    ReactDOM.render(
      React.createElement(activeScene),
      document.getElementById('animationContainer')
    );
    
  }

  const [showInfo, setShowInfo] = React.useState(false);
  function handleShowInfo(show) {
    setShowInfo(show);
    if (show) {
      ReactDOM.render(
        <img className={classes.painting} alt="activeInfo" src={activeInfo} />,
        document.getElementById("animationContainer")
      );
    }
    else {
      if( activeAnimation === null)
        showScene();
      else
        showAnimation();
    }
  }

  return (
    <Paper className={classes.root}>
      <Box position="absolute"
           top='10px'
           left='10px'>
        <Link href="https://www.rogerdean.com" color="inherit" underline="always" variant="subtitle1">           
          <img height="172px" alt="Bird" src={BirdImage} />
        </Link>
      </Box> 

      <Box position="absolute"
           top='0px'
           left='225px'>
        <Link href="https://www.rogerdean.com" color="inherit" underline="always" variant="subtitle1">
          <img height="146px" alt="Logo" src={LogoImage} />
        </Link>
      </Box> 
      
      <Box position="absolute"
           top='170px'
           left='80px'
           width='500px'>
        <Paper className={classes.paper} elevation={8}>
          <ButtonBase onClick={() => handleOpenAnimation(ISLANDS_PATH, null, IslandsInfo, classes.islands, "Islands")}>
            <img className={classes.painting} alt="Islands" src={IslandsImage} />
          </ButtonBase>
            <Grid container justify="flex-end" className={classes.title}>
              <Grid item xs={4}>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6">
                  <Box fontStyle="italic" textAlign="center" m={1.0} color="disabled">
                    Islands
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="right">
                  <IconButton
                    color="disabled"
                    edge="end"
                    textAlign="right"
                    onClick={() => handleOpenAnimation(ISLANDS_PATH, null, IslandsInfo, classes.islands, "Islands")}>
                    <PlayCircleOutlineOutlinedIcon/>
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
        </Paper>
      </Box>

      <Box position="absolute"
           top='130px'
           left='700px'
           width='500px'>
        <Paper className={classes.paper} elevation={8}>
          <ButtonBase onClick={() => handleOpenAnimation(BRIDGE_PATH, null, BridgeInfo, classes.bridge, "Bridge")}>
            <img className={classes.painting} alt="Bridge" src={BridgeImage}/>
          </ButtonBase>
          <Grid container justify="flex-end" className={classes.title}>
            <Grid item xs={4}>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.title} variant="h6">
                <Box fontStyle="italic" textAlign="center" m={1.0}>
                  Bridge
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="right">
                <IconButton
                  color="disabled"
                  edge="end"
                  onClick={() => handleOpenAnimation(BRIDGE_PATH, null, BridgeInfo, classes.bridge, "Bridge")}>
                  <PlayCircleOutlineOutlinedIcon/>
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      
      <Box position="absolute"
           top='80px'
           right='80px'
           width='500px'>
        <Paper className={classes.paper} elevation={8}>
          <ButtonBase onClick={() => handleOpenAnimation(FLIGHTS_PATH, null, FlightsInfo, classes.flights, "Flights")}>
            <img className={classes.painting} alt="Flights" src={FlightsImage} />
          </ButtonBase>
          <Grid container justify="flex-end" className={classes.title}>
            <Grid item xs={4}>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.title} variant="h6">
                <Box fontStyle="italic" textAlign="center" m={1.0}>
                  Flights
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="right">
                <IconButton
                  color="disabled"
                  edge="end"
                  onClick={() => handleOpenAnimation(FLIGHTS_PATH, null, FlightsInfo, classes.flights, "Flights")}>
                  <PlayCircleOutlineOutlinedIcon/>
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>        

      <Box position="absolute"
           bottom='30px'
           right='420px'
           width='500px'>
        <Paper className={classes.paper} elevation={8}>
          <ButtonBase onClick={() => handleOpenAnimation(PARROT_PATH, null, ParrotInfo, classes.parrot, "Parrot island")}>
            <img className={classes.painting} alt="Parrot" src={ParrotImage} />
          </ButtonBase>
          <Grid container justify="flex-end" className={classes.title}>
            <Grid item xs={4}>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.title} variant="h6">
                <Box fontStyle="italic" textAlign="center" m={1.0}>
                  Parrot&nbsp;island
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="right">
                <IconButton
                  color="disabled"
                  edge="end"
                  onClick={() => handleOpenAnimation(PARROT_PATH, null, ParrotInfo, classes.parrot, "Parrot island")}>
                  <PlayCircleOutlineOutlinedIcon/>
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Box position="absolute"
           bottom='40px'
           left='280px'
           width='500px'>
        <Paper className={classes.paper} elevation={8}>
          <ButtonBase onClick={() => handleOpenAnimation(FETCH_PATH, null, FetchInfo, classes.fetch, "Fetch")}>
            <img className={classes.painting} alt="Fetch" src={FetchImage} />
          </ButtonBase>
          <Grid container justify="flex-end" className={classes.title}>
            <Grid item xs={4}>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.title} variant="h6">
                <Box fontStyle="italic" textAlign="center" m={1.0}>
                  Fetch
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="right">
                <IconButton
                  color="disabled"
                  edge="end"
                  onClick={() => handleOpenAnimation(FETCH_PATH, null, FetchInfo, classes.fetch, "Fetch")}>
                  <PlayCircleOutlineOutlinedIcon/>
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

{/* // TODO: Complete TFTO scene
      <Box position='absolute'
           bottom='280px'
           left='480px'
           width='500px'>
        <Paper className={classes.paper} elevation={8}>
          <ButtonBase onClick={() => handleOpenAnimation(null, sceneTFTO, TFTOInfo, classes.tfto, "Tales from Topographic Oceans")}>
            <img className={classes.painting} alt="Tales from Topographic Oceans" src={TFTOImage} />
          </ButtonBase>
          <Grid container justify="flex-end" className={classes.title}>
            <Grid item xs={4}>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.title} variant="h6">
                <Box fontStyle="italic" textAlign="center" m={1.0}>
                Tales from Topographic Oceans
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="right">
                <IconButton
                  color="disabled"
                  edge="end"
                  onClick={() => handleOpenAnimation(null, sceneTFTO, TFTOInfo, classes.tfto, "Tales from Topographic Oceans")}>
                  <PlayCircleOutlineOutlinedIcon/>
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>        
*/}
      <Dialog
        maxWidth={false}
        open={openAnimation}
        onClose={handleCloseAnimation}
        onEntering={ activeAnimation === null ? showScene : showAnimation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        // fullScreen={activeScene != null} // Future use for large scene rendering
        classes={{ paper: classes.dialogPaper }}>
        <DialogContent>
          <div className={activeStyle} id="animationContainer">
          </div>
          <Grid item xs={4}>
          </Grid>
          <Grid container justify="flex-end">
           <Grid item xs={4}>
              <Typography className={classes.title} variant="h6">
                <Box fontStyle="italic" textAlign="center" m={1.0}>
                  {activeAnimationTitle}
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="right">
                <IconButton
                  color="disabled"
                  edge="end"
                  onClick={() => handleShowInfo(!showInfo)}>
                  { showInfo ? <PlayCircleOutlineOutlinedIcon/> : <InfoOutlined/> }
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Box position="absolute"
           bottom='35px'
           right='9%'
           fontStyle="italic">
        <Typography>
          Graphics by&nbsp; 
          <Link href="https://www.rogerdean.com" color="inherit" underline="always" variant="subtitle1">
            Roger Dean
          </Link>
        </Typography>
      </Box>
      <Box position="absolute"
           bottom='10px'
           right='7.5%'
           fontStyle="italic">
        <Typography>
          Animations by &nbsp; 
          <Link href="https://github.com/syanenko/deanworld" color="inherit" underline="always" variant="subtitle1">
            Yesbird
          </Link>
        </Typography>
      </Box>
        
    </Paper>
  );
}

export default App;
