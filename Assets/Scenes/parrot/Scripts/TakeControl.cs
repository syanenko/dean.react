using UnityEngine;
using System.Collections;


public class TakeControl : MonoBehaviour
{
	public float Velocity = 0.2F;

	private Vector3 offset;
	private Vector3 origin;
	private Animator anim;

	private AnimationCurve  curve_x;
	private AnimationCurve  curve_y;
	private float           curveTime;
	private bool            curveUpdate = false;

	void Start ()
	{
		origin = transform.position;
		anim = GetComponent<Animator>();
	}

	void Update ()
	{
		UpdateCurves();
	}
	
	private void UpdateCurves()
	{
		if(curveUpdate)
		{
			curveTime += Time.deltaTime;
			float x = curve_x.Evaluate(curveTime);
			float y = curve_y.Evaluate(curveTime);
			transform.position = new Vector3(x, y, transform.position.z );

			Keyframe kx = curve_x[curve_x.length - 1];
			if(curveTime >= kx.time)
			{
				curve_x = null;
				curve_y = null;
				anim.enabled = true;
				Debug.Log("Nu ?");
				curveUpdate = false;
			}
		}
	}

	void OnMouseDown()
	{
		curveUpdate = false;
		anim.enabled = false;
		anim.Play(0,-1);

		offset = transform.position - Camera.main.ScreenToWorldPoint(new Vector3(Input.mousePosition.x,Input.mousePosition.y, 0));
	}
	
	void OnMouseDrag ()
	{
		Vector3 curScreenSpace = new Vector3(Input.mousePosition.x, Input.mousePosition.y, 0);
		Vector3 curPosition = Camera.main.ScreenToWorldPoint(curScreenSpace) + offset;
		transform.position = curPosition;
	}

	void OnMouseUp()
	{
		float endTime = Vector3.Distance( transform.position, origin ) / Velocity;
		curve_x = AnimationCurve.Linear( 0, transform.position.x, endTime, origin.x );
		curve_y = AnimationCurve.Linear( 0, transform.position.y, endTime, origin.y );
		curveTime = 0;
		curveUpdate = true;
	}
}
