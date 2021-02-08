using UnityEngine;
using System.Collections.Generic;

public class Orbits : MonoBehaviour
{
    public int   driftPoints = 8;
    public float driftX = 0.2F;
    public float driftY = 0.1F;

    public int orbitPoints = 30;
    public Rect[] orbitRegionsHigh = new Rect[4];
    public Rect[] orbitRegionsLow  = new Rect[4];

    private const int X = 0;
    private const int Y = 1;
    private float inTangent  = 0;
    private float outTangent = 0;

    /// <summary>
    /// Start
    /// </summary>
    void Start()
    {
        Random.seed = GetInstanceID();
    }

    /// <summary>
    /// Init on reset script
    /// </summary>
    void Reset ()
    {
        orbitRegionsHigh[0] = new Rect(0, 0, 1, 2);
        orbitRegionsHigh[1] = new Rect(1, 1, 2, 1.5F);
        orbitRegionsHigh[2] = new Rect(3, 2, 2, 2);
        orbitRegionsHigh[3] = new Rect(2, 2, 0.5F, 1);

        orbitRegionsLow[0] = new Rect(-1, -1, 1, 2);
        orbitRegionsLow[1] = new Rect(-1, -1, 2, 1.5F);
        orbitRegionsLow[2] = new Rect(-3, -2, 2, 2);
        orbitRegionsLow[3] = new Rect(-2, -2, 0.5F, 1);
    }

    /// <summary>
    /// Get random point from region
    /// </summary>
    /// <param name="n"></param>
    /// <returns>Vector3 Point</returns>
    private Vector3 GetRegionPoint(Rect r)
    {
        return new Vector3(UnityEngine.Random.Range(r.x, r.x + r.width),
                           UnityEngine.Random.Range(r.y, r.y + r.height),
                           0);
    }

    /// <summary>
    /// Create drift orbit
    /// </summary>
    public void Drift(Vector3 origin, float speed, out AnimationCurve[] ac)
    {
        Keyframe[][] kf = new Keyframe[2][];
        kf[X] = new Keyframe[driftPoints + 2];
        kf[Y] = new Keyframe[driftPoints + 2];

        kf[X][0] = new Keyframe(0, origin.x, inTangent, outTangent);
        kf[Y][0] = new Keyframe(0, origin.y, inTangent, outTangent);

        for (int i = 1; i <= driftPoints; i++)
        {
            kf[X][i] = new Keyframe(i / speed, origin.x + (driftX * Random.value), inTangent, outTangent);
            kf[Y][i] = new Keyframe(i / speed, origin.y + (driftY * Random.value), inTangent, outTangent);
        }

        kf[X][driftPoints + 1] = new Keyframe((driftPoints + 1) / speed, origin.x, inTangent, outTangent);
        kf[Y][driftPoints + 1] = new Keyframe((driftPoints + 1) / speed, origin.y, inTangent, outTangent);

        // Curves
        ac = new AnimationCurve[2];
        ac[X] = new AnimationCurve(kf[X]);
        ac[Y] = new AnimationCurve(kf[Y]);

        // Smooth curves
        for (int i = 0; i < ac[X].keys.Length; ++i)
        {
            ac[X].SmoothTangents(i, 0);
            ac[Y].SmoothTangents(i, 0);
        }
    }

    /// <summary>
    /// Create flight orbit 
    /// </summary>
    public void Flight(Vector3 start, Vector3 finish, int regnum, float speed, out AnimationCurve[] ac)
    {
        Rect[] regions;
        switch (regnum)
        {
            case 0:  regions = orbitRegionsHigh; break;
            case 1:  regions = orbitRegionsLow; break;
            default: regions = orbitRegionsHigh; break;
        }

        // Bezier base
        BezierCurve bc;
        List<Vector3> keys = new List<Vector3>();

        bc = GetComponent<BezierCurve>();
        bc.resolution = 30;
        bc.close = true;
        bc.drawColor = Color.green;

        bc.AddPointAt(start);
        for (int i = 0; i < regions.Length; i++)
        {
            bc.AddPointAt(GetRegionPoint(regions[i]));
        }
        bc.AddPointAt(finish);

        BezierPoint[] pa = bc.GetAnchorPoints();

        // Smooth Bezier curves by handles
        float scale = 0.3F;
        for (int i = 0; i < pa.Length; i++)
        {
            if (i == 0) // First
            {
                Vector3 p0 = pa[pa.Length - 1].position;
                Vector3 p1 = pa[i].position;
                Vector3 p2 = pa[i + 1].position;
                Vector3 tangent = (p2 - p0).normalized;
                Vector3 q0 = p1 - scale * tangent * (p1 - p0).magnitude;
                Vector3 q1 = p1 + scale * tangent * (p2 - p1).magnitude;

                pa[i].globalHandle1 = q0;
                pa[i].globalHandle2 = q1;
            }
            else if (i == pa.Length - 1) // Last
            {
                Vector3 p0 = pa[i - 1].position;
                Vector3 p1 = pa[i].position;
                Vector3 p2 = pa[0].position;
                Vector3 tangent = (p2 - p0).normalized;
                Vector3 q0 = p1 - scale * tangent * (p1 - p0).magnitude;
                Vector3 q1 = p1 + scale * tangent * (p2 - p1).magnitude;

                pa[i].globalHandle1 = q0;
                pa[i].globalHandle2 = q1;
            }
            else // Middle
            {
                Vector3 p0 = pa[i - 1].position;
                Vector3 p1 = pa[i].position;
                Vector3 p2 = pa[i + 1].position;
                Vector3 tangent = (p2 - p0).normalized;
                Vector3 q0 = p1 - scale * tangent * (p1 - p0).magnitude;
                Vector3 q1 = p1 + scale * tangent * (p2 - p1).magnitude;

                pa[i].globalHandle1 = q0;
                pa[i].globalHandle2 = q1;
            }
        }

        Keyframe[][] kf = new Keyframe[2][];
        kf[X] = new Keyframe[orbitPoints + 1];
        kf[Y] = new Keyframe[orbitPoints + 1];

        kf[X][0] = new Keyframe(0, start.x, inTangent, outTangent);
        kf[Y][0] = new Keyframe(0, start.y, inTangent, outTangent);

        float step = 1F / orbitPoints;
        float pos = 0;
        for (int i = 1; i < orbitPoints; i++)
        {
            Vector3 p = bc.GetPointAt(pos);

            kf[X][i] = new Keyframe(i / speed, p.x, inTangent, outTangent);
            kf[Y][i] = new Keyframe(i / speed, p.y, inTangent, outTangent);

            pos += step;
        }

        kf[X][orbitPoints] = new Keyframe((orbitPoints + 1) / speed, finish.x, inTangent, outTangent);
        kf[Y][orbitPoints] = new Keyframe((orbitPoints + 1) / speed, finish.y, inTangent, outTangent);

        // Curves
        ac = new AnimationCurve[2];
        ac[X] = new AnimationCurve(kf[X]);
        ac[Y] = new AnimationCurve(kf[Y]);

        // Smooth curves
        for (int i=0; i<ac[X].keys.Length; i++)
        {
            ac[X].SmoothTangents(i, 0);
            ac[Y].SmoothTangents(i, 0);
        }

        // Clean up
        for (int i = 0; i < pa.Length; i++)
        {
            bc.RemovePoint(pa[i]);
        }
    }

    /// <summary>
    /// Gizmos
    /// </summary>
    void OnDrawGizmos()
    {
        // orbitRegionsHigh
        for (int i=0; i<orbitRegionsHigh.Length; i++)
        {
            Gizmos.color = Color.yellow;

            Gizmos.DrawLine(new Vector3(orbitRegionsHigh[i].x, orbitRegionsHigh[i].y, 0),
                            new Vector3(orbitRegionsHigh[i].x + orbitRegionsHigh[i].width, orbitRegionsHigh[i].y, 0));

            Gizmos.DrawLine(new Vector3(orbitRegionsHigh[i].x + orbitRegionsHigh[i].width, orbitRegionsHigh[i].y, 0),
                            new Vector3(orbitRegionsHigh[i].x + orbitRegionsHigh[i].width, orbitRegionsHigh[i].y + orbitRegionsHigh[i].height, 0));

            Gizmos.DrawLine(new Vector3(orbitRegionsHigh[i].x + orbitRegionsHigh[i].width, orbitRegionsHigh[i].y + orbitRegionsHigh[i].height, 0),
                            new Vector3(orbitRegionsHigh[i].x, orbitRegionsHigh[i].y + orbitRegionsHigh[i].height, 0));

            Gizmos.DrawLine(new Vector3(orbitRegionsHigh[i].x, orbitRegionsHigh[i].y + orbitRegionsHigh[i].height, 0),
                            new Vector3(orbitRegionsHigh[i].x, orbitRegionsHigh[i].y, 0));
        }

        // orbitRegionsLow
        for (int i = 0; i < orbitRegionsLow.Length; i++)
        {
            Gizmos.color = Color.red;

            Gizmos.DrawLine(new Vector3(orbitRegionsLow[i].x, orbitRegionsLow[i].y, 0),
                            new Vector3(orbitRegionsLow[i].x + orbitRegionsLow[i].width, orbitRegionsLow[i].y, 0));

            Gizmos.DrawLine(new Vector3(orbitRegionsLow[i].x + orbitRegionsLow[i].width, orbitRegionsLow[i].y, 0),
                            new Vector3(orbitRegionsLow[i].x + orbitRegionsLow[i].width, orbitRegionsLow[i].y + orbitRegionsLow[i].height, 0));

            Gizmos.DrawLine(new Vector3(orbitRegionsLow[i].x + orbitRegionsLow[i].width, orbitRegionsLow[i].y + orbitRegionsLow[i].height, 0),
                            new Vector3(orbitRegionsLow[i].x, orbitRegionsLow[i].y + orbitRegionsLow[i].height, 0));

            Gizmos.DrawLine(new Vector3(orbitRegionsLow[i].x, orbitRegionsLow[i].y + orbitRegionsLow[i].height, 0),
                            new Vector3(orbitRegionsLow[i].x, orbitRegionsLow[i].y, 0));
        }
    }
}
