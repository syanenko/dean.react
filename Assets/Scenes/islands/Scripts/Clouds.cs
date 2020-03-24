using UnityEngine;
using System.Collections;

public class Clouds : MonoBehaviour {

	void Start ()
	{
		GetComponent<ParticleSystem>().GetComponent<Renderer>().sortingLayerName = "Clouds";
		GetComponent<ParticleSystem>().GetComponent<Renderer>().sortingOrder = 0;
	}
	
	void Update ()
	{
	
	}
}
