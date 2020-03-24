using UnityEngine;
using System.Collections;
using System.Collections.Generic;


/// <summary>
/// Timer
/// </summary>
public class Timer
{
    /// <summary>
    /// Set timer for (0 - delta) seconds
    /// </summary>
    /// <param name="delta"></param>
    public Timer(float minTime, float maxTime)
    {
        min = minTime;
        delta = maxTime - minTime;
        Ready();
    }

    /// <summary>
    /// If time is elapsed
    /// </summary>
    /// <returns>If elapsed reurns 'true', 'false' otherwise</returns>
    public bool Ready()
    {
        elapsed += Time.deltaTime;

        if (elapsed > max)
        {
            elapsed = 0;
            max = UnityEngine.Random.Range(min, min + delta);
            Debug.Log(string.Format("min = {0}, max = {1},  delta={2}", min, max, delta));
            return true;  
        }

        return false;
    }

    private float min;
    private float max;
    private float delta;
    private float elapsed;
}


/// <summary>
/// Main
/// </summary>
public class FlyingRock : MonoBehaviour
{
    public bool canFly = true;
    public int regionNumber    = 0;
    public float driftSpeed    = 0.5F;
	public float flightSpeed   = 8F;
    public float RotationSpeed = 0F;
    public float minDriftTime = 10;
    public float maxDriftTime = 120;

    private const int X = 0;
    private const int Y = 1;

    private Vector3 origin;
    private Orbits orbits;
    private AnimationCurve[] ac = new AnimationCurve[2];
    private float rotation;
    private float curTime = 0;

    private Timer timer;
    private ParticleSystem trace;

	/// <summary>
    /// Start 
	/// </summary>
    void Start ()
	{
        Random.seed = GetInstanceID();

        timer = new Timer(minDriftTime, maxDriftTime);
        orbits = GameObject.Find("Main Camera").GetComponent<Orbits>();
		origin = transform.position;
        trace = GetComponent<ParticleSystem>();

		Drift();
	}
	
	/// <summary>
    /// Update
	/// </summary>
    void Update ()
	{
        if (timer.Ready())
        {
            Flight();
        }

        Animate();
	}

	void OnMouseDown()
	{
        Flight();
	}

    /// <summary>
    /// Start drift
    /// </summary>
    private void Drift()
    {
        if (trace != null)
        {
            trace.enableEmission = false;
        }

        // Position
        orbits.Drift(origin, driftSpeed, out ac);

        // Rotation
        if (rotation == 0)
        {
            RotationSpeed = -RotationSpeed;
            rotation = RotationSpeed;
        }
        else
        {
            rotation = 0;
        }

        curTime = 0;
    }

    /// <summary>
    /// Start flight
    /// </summary>
	private void Flight()
	{
        if (!canFly) return;

        if (trace != null)
        {
            trace.enableEmission = true;
        }

        // Position
        orbits.Flight(transform.position, origin, regionNumber, flightSpeed, out ac);

		// Rotation
		if(rotation == 0)
		{
			RotationSpeed = -RotationSpeed;
			rotation = RotationSpeed;
		}else
		{
			rotation = 0;
		}
		
		curTime = 0;
	}

    /// <summary>
    /// Evaluate animation
    /// </summary>
	private void Animate()
	{
		curTime += Time.deltaTime;
        float x = ac[X].Evaluate(curTime);
        float y = ac[Y].Evaluate(curTime);

		transform.position = new Vector3(x, y, transform.position.z );
		transform.Rotate(Vector3.forward * rotation);

        Keyframe kft = ac[X][ac[X].length - 1];

		if(curTime >= kft.time)
		{
			Drift();
		}
	}

    /// <summary>
    /// Gizmos
    /// </summary>
	private void OnDrawGizmos()
	{
        if ((ac[X] != null) && (ac[X] != null))
        {
            if ((ac[X].keys.Length > 0) &&
                (ac[Y].keys.Length > 0))
            {
                Vector3 cube = new Vector3(0.05F, 0.05F, 0.05F);
                Vector3 pp = new Vector3(ac[X].keys[X].value, ac[Y].keys[X].value, 0);

                Gizmos.color = Color.green;
                Gizmos.DrawCube(pp, cube);

                for (int i = 1; i < ac[X].keys.Length; i++)
                {
                    Vector3 p = new Vector3(ac[X].keys[i].value, ac[Y].keys[i].value, 0);
                    Gizmos.DrawLine(pp, p);
                    Gizmos.DrawCube(p, cube);
                    pp = p;
                }
            }
        }
	}
}
