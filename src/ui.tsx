
import { useMediaQuery } from 'react-responsive';

import { useState, useEffect } from 'react';

import { Model, Param, ParamSet } from './fass';

import Stage from './components/stage'
import Button from './components/ui/button';
import ModelSelectionModal from './components/modals/modelSelectionModal';
import PeanoConsole from './components/consoles/peanoConsole';
import HilbertConsole from './components/consoles/hilbertConsole';

import { reset, init, generate, regenerate, draw } from './main';


const peanoParamSchema: Param[] = [

	{ id: 'mkp1', name: 'iterationsNum', value: 3, range: [1, 5], step: 1, label: "P1", },
	{ id: 'mkp2', name: 'empty', value: 3, range: [1, 10], step: 1, label: "P2", },
	{ id: 'mkp5', name: 'empty', value: 1, range: [1, 3], step: 0.01, label: "P3", },
	{ id: 'mkp3', name: 'empty', value: 1, range: [0, 2], step: 0.01, label: "P4", },
	{ id: 'mkp4', name: 'empty', value: 15, range: [0, 30], step: 0.1, label: "P5", },
	{ id: 'mkp6', name: 'empty', value: 1, range: [0, 2], step: 0.01, label: "P6", },
	{ id: 'mkp7', name: 'empty', value: 1, range: [0, 2], step: 0.01, label: "P7", },
];


const hilbertParamsSchema: Param[] = [

	{ id: 'ogp1', name: 'iterationsNum', value: 3, range: [1, 5], step: 1, label: "P1", },
	{ id: 'ogp2', name: 'empty', value: 0.5, range: [0, 2], step: 0.01, label: "P2", },
	{ id: 'ogp3', name: '', value: 1, range: [0, 2], step: 1, label: "Olga P3", },
	{ id: 'ogp4', name: '', value: 0.5, range: [0, 2], step: 1, label: "Olga P4", },
	{ id: 'ogp5', name: '', value: 1, range: [0, 2], step: 1, label: "Olga P5", },
	{ id: 'ogp6', name: '', value: 1, range: [0, 2], step: 1, label: "Olga P6", },
	{ id: 'ogp7', name: '', value: 1, range: [0, 2], step: 1, label: "Olga P7", },
];

// -----------------------------------------------------------------------------------------------------------------

const models: Model[] = [

	{ option: "PEANO", 		label: "Peano", 		icon: "TEST", 		console: PeanoConsole, 		params: peanoParamSchema, 		default: false, checked: false },
	{ option: "HILBERT", 	label: "Hilbert", 		icon: "TEST", 		console: HilbertConsole, 	params: hilbertParamsSchema, 	default: false, checked: false },
];


const UI = () => {


	// -------------------------------------------------------------------------------------------------------------


	const [isDesktopOrLaptop, setIsDesktopOrLaptop] = useState(false);
	const [isPaperLoaded, setIsPaperLoaded] = useState(false);

	const [ initialized, setInitialized ] = useState(false);

	const [ inModelSelectionScreen, setInModelSelectionScreen ] = useState<boolean>( true );

	const [currentModel, setCurrentModel] = useState<Model | null>(null);
	const [paramsForModel, setParamsForModel] = useState<ParamSet | null>(null);

	const [scaleCtrl, setScaleCtrl] = useState(3);


	const _isDesktopOrLaptop = useMediaQuery({
    	
		query: '(min-width: 1224px)'
	});

	
	//-----------------------------------------------------------------------------
	// HOOKS


	useEffect(() => {

		setIsDesktopOrLaptop(_isDesktopOrLaptop);

	}, [ _isDesktopOrLaptop ] );
	

	useEffect(() => { 

		if (isPaperLoaded) {

			const _modelParams: any = {};

			if (currentModel === null) {

				// TODO: error message

			} else {

				Array.from(currentModel.params.values()).forEach((p: any) => {

					_modelParams[p.name] = p.value;
				});

				reset();
				draw(scaleCtrl, _modelParams);
			}
		}

	}, [ currentModel, paramsForModel ] );



	//-----------------------------------------------------------------------------
	// HANDLERS


	function handleGenerateAction(selectedModel: any) {

		if ( isPaperLoaded ) {

			const _modelParams: any = {};

			Array.from(selectedModel?.params.values() || []).forEach((p: any) => {

				_modelParams[p.name] = p.value; 

			});
			

			reset();
			init(selectedModel.option)
			generate(_modelParams);
			draw(scaleCtrl, _modelParams);

			setCurrentModel(selectedModel);
			setParamsForModel(selectedModel.params);

			setInModelSelectionScreen( false );

			if ( !initialized ) { setInitialized(true) };

		} else {

		}
	};


	function handleRegenerateAction(selectedModel: any) {

		if ( isPaperLoaded && currentModel ) {
			
			console.log(`ready to regenerate ${selectedModel.label}`);

			const _modelParams: any = {};


			Array.from(selectedModel?.params.values() || []).forEach((p: any) => {

				_modelParams[p.name] = p.value; 

			});


			reset();
			regenerate(_modelParams);
			draw(scaleCtrl, _modelParams);


		} else {

		}
	};
	

	function handleParamCtrlInputForModel(updatedParams: any) {

		setParamsForModel(updatedParams);
	}


	// -------------------------------------------------------------------------------------------------------

	
	function switchConsole( model: Model ) {

		const Console = model.console;

		return ( <Console  params={paramsForModel} inputHandler={handleParamCtrlInputForModel} /> )
	}


	return (
        
		<div className={`relative w-3/4 h-[80vh] m-5 border border-slate-900`}>

		  	
			<div className={`w-full h-full`}>

				{isDesktopOrLaptop && (

					<Stage

						onPaperLoad={setIsPaperLoaded}
					/>
				)}

			</div>

			<div className={`absolute top-0 left-0 w-full h-full`}>
        		
        		{

        			isDesktopOrLaptop && inModelSelectionScreen && (

        				<ModelSelectionModal 

        					initialized={ initialized }
        					options={ models }
        					onGenerate={ handleGenerateAction }
        					onClose={ () => setInModelSelectionScreen(false) }
        				/>

        			)
        		}

        	</div>


			<div className={`absolute ${isDesktopOrLaptop ? "top-0" : "top-0"} left-0 ${isDesktopOrLaptop ? "max-w-[250px]" : "w-full"} ${isDesktopOrLaptop ? "h-fit" : "h-[70vh]"} m-5 border border-slate-900`} > 

				{
		    		currentModel && !inModelSelectionScreen && switchConsole( currentModel )
		    	}

			</div>

			<div className={`absolute top-0 right-0 m-2`}>
		    	
		    	{
		    		!inModelSelectionScreen && (

			    		<Button

							labelText="new"
							onClickEventHandler={ handleGenerateAction }
						/>
					)
		    	}

		    </div>


		    <div className={`absolute bottom-0 right-0 m-2`}>

		    	{
		    		!inModelSelectionScreen && currentModel && (

						<Button

							labelText="regenerate"
							onClickEventHandler={ handleRegenerateAction }
						/>
		    		)
		    	}
			
			</div>

		</div>

	)
};

export default UI;