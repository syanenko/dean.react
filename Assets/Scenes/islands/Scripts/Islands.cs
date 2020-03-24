using UnityEngine;
using System.Collections;

public class Islands : MonoBehaviour {
	
	public Vector2 Position_low_left;
	public Vector2 Position_up_right;
	public Vector3 scale;
	public Vector3 impulse;
	public float ImpulsCoeff = 1;
	public bool flip = false;

	static Color invisible = new Color(1,1,1,0.0F);
	static Color visible   = new Color(1,1,1,1F);
	Color current = visible;
	
	static float fade_step = 0.002f;
	static Vector3 scale_step = new Vector3 (0.001F, 0.001F, 0);
	
	static int INIT_DELAY = 30;
	int delay = INIT_DELAY;

	private Vector3 offset;
	
	//
	// Mouse
	//
	void OnMouseDown()
	{
		offset = transform.position - Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x, Input.mousePosition.y, 0));
	}
	
	void OnMouseDrag ()
	{
		transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x, Input.mousePosition.y, 0)) + offset;
	}
	
	void OnMouseUp()
	{
        float x = Input.GetAxis("Mouse X");
        float y = Input.GetAxis("Mouse Y");
        Debug.Log("x: " + x);
        Debug.Log("y: " + y);

        GetComponent<Rigidbody>().AddForce(new Vector3 (x, y) * ImpulsCoeff, ForceMode.Acceleration);
	}

	//
	// CheckVisibility
	//
	void CheckVisibility()
	{
		if( !GetComponent<Renderer>().isVisible )
		{
			Reset();
		}
	}
	
	//
	// Delay
	//
	void Delay()
	{
		delay--;
		if(delay == 0)
		{
			Init();
		}
	}
	
	
	
	//
	// Unfade
	//
	void Unfade()
	{
		if(GetComponent<Renderer>().material.color.a < 1)
		{
			float alpha = current.a + fade_step;
			if(alpha > 1)
				current.a = 1;
			else
				current.a = alpha;
			GetComponent<Renderer>().material.color = current;
		}
	}
	
	//
	// Unscale
	//
	void Unscale()
	{
		if(transform.localScale.x < 1)
		{
			GetComponent<Rigidbody>().transform.localScale += scale_step;
		}
	}


	//
	// Reset
	//
	void Reset()
	{
		current = invisible;
		GetComponent<Renderer>().material.color = current;

		GetComponent<Rigidbody>().velocity = Vector3.zero;
		GetComponent<Rigidbody>().transform.localScale = scale;

		float dx = Position_up_right.x - Position_low_left.x;
		float dy = Position_up_right.y - Position_low_left.y;
		float x = (Random.value * dx) + Position_low_left.x;
		float y = (Random.value * dy) + Position_low_left.y;

		GetComponent<Rigidbody>().MovePosition(new Vector3(x, y, 0));

		if(flip && ( Mathf.Sign(x) < 0 ))
		{
			impulse = -impulse;
			transform.Rotate(new Vector3(0,180,0));
		}

		delay = INIT_DELAY;
	}


	//
	// Init current island
	// 
	void Init()
	{
		GetComponent<Rigidbody>().AddForce(impulse);
	}
	
	//
	// Start
	//
	void Start ()
	{
		print ("Start ... ");
		Random.seed = System.DateTime.UtcNow.Second;
	}
	
	//
	// Update
	// 
	void Update ()
	{
		Delay();
		Unfade();
		Unscale();
		CheckVisibility();
	}
	
}
